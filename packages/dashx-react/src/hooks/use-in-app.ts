import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { WebsocketMessage, IN_APP_MESSAGES_PAGE_SIZE } from '@dashx/browser';
import type { InAppMessages, WebsocketMessageType } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';
import { useWebSocket } from '../providers/DashXProvider.js';

type UseInAppHookResponse = {
  messages: InAppMessages;
  unreadMessagesCount: number | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
  markMessageAsRead: (id: string) => Promise<any>;
  markMessageAsUnread: (id: string) => Promise<any>;
  markAllMessagesAsRead: () => Promise<any>;
};

type UseInAppOptions = {
  /**
   * Fires a react-hot-toast for every live IN_APP_MESSAGE. Only useful with a mounted
   * `<Toast>`, which is also what runs react-hot-toast's expiration timers - without one
   * the toasts never render and its store just retains the last few entries. Set false
   * when the host renders its own notification stack.
   */
  showToast?: boolean;
};

const useInApp = ({ showToast = true }: UseInAppOptions = {}): UseInAppHookResponse => {
  let dashX = useDashXProvider();
  const { subscribe } = useWebSocket();
  const [messages, setMessages] = useState<InAppMessages>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // `trackMessage` and `trackAllMessages` throw SYNCHRONOUSLY when no account is
  // identified, before any promise exists, so a chained `.catch` never sees it and the
  // error escapes into the caller's click handler. Route both shapes through one guard.
  const reportFailure = (message: string) => (error: unknown) => {
    console.error(message, error);
  };

  const trackQuietly = (track: () => unknown, message: string): Promise<void> => {
    const onFailure = reportFailure(message);

    try {
      return Promise.resolve(track()).then(
        () => undefined,
        (error: unknown) => {
          onFailure(error);
        },
      );
    } catch (error) {
      onFailure(error);
      return Promise.resolve();
    }
  };

  const markMessageAsRead = (id: string) =>
    trackQuietly(
      () => dashX.trackMessage({ id, status: 'READ' }),
      'DashX: failed to mark in-app message as read',
    );

  const markMessageAsUnread = (id: string) =>
    trackQuietly(
      () => dashX.trackMessage({ id, status: 'UNREAD' }),
      'DashX: failed to mark in-app message as unread',
    );

  const markAllMessagesAsRead = () =>
    trackQuietly(
      () => dashX.trackAllMessages(),
      'DashX: failed to mark all in-app messages as read',
    );

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const { hasMore: more } = await dashX.fetchMoreInAppMessages();
      setHasMore(more);
    } catch (error) {
      // hasMore stays true so a later scroll retries the page.
      console.error('DashX: failed to fetch more in-app messages', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    // Set up in-app message watchers (automatically refetch on WebSocket reconnection).
    // Both return an unsubscribe; without calling it the watchQuery subscriptions outlive
    // the component and keep pushing state into it after unmount.
    const unwatchMessages = dashX.watchFetchInAppMessages((nextMessages) => {
      setMessages(nextMessages);
      // While the list is a single page (initial load, empty inbox, or a reconnect
      // refetch of page 1), a full page implies more; past that, loadMore owns hasMore.
      if (nextMessages.length <= IN_APP_MESSAGES_PAGE_SIZE) {
        setHasMore(nextMessages.length === IN_APP_MESSAGES_PAGE_SIZE);
      }
    });
    const unwatchAggregate = dashX.watchFetchInAppMessagesAggregate(setUnreadMessagesCount);

    return () => {
      unwatchMessages();
      unwatchAggregate();
    };
  }, [dashX]);

  useEffect(() => {
    if (!showToast) return;

    // Subscribe to WebSocket messages for in-app messages
    const unsubscribe = subscribe((message: WebsocketMessageType) => {
      // Handle only IN_APP_MESSAGE for toast display
      // The client handles all other message processing internally
      if (message?.type === WebsocketMessage.IN_APP_MESSAGE) {
        toast(message.data.renderedContent.body);
      }
    });

    return unsubscribe;
  }, [subscribe, showToast]);

  return {
    messages,
    unreadMessagesCount,
    hasMore,
    isLoadingMore,
    loadMore,
    markMessageAsRead,
    markMessageAsUnread,
    markAllMessagesAsRead,
  };
};

export default useInApp;
export type { UseInAppOptions };

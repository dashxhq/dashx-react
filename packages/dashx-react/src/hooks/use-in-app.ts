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

const useInApp = (): UseInAppHookResponse => {
  let dashX = useDashXProvider();
  const { subscribe } = useWebSocket();
  const [messages, setMessages] = useState<InAppMessages>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const markMessageAsRead = (id: string) => dashX.trackMessage({ id, status: 'READ' });

  const markMessageAsUnread = async (id: string) =>
    dashX.trackMessage({ id, status: 'UNREAD' });

  // One mutation marking everything unread (sent up to now) as read - including messages
  // beyond the loaded pages - instead of one trackMessage call per message.
  const markAllMessagesAsRead = () => dashX.trackAllMessages();

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const { hasMore: more } = await dashX.fetchMoreInAppMessages();
      setHasMore(more);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    // Set up in-app message watchers (automatically refetch on WebSocket reconnection)
    dashX.watchFetchInAppMessages((nextMessages) => {
      setMessages(nextMessages);
      // Re-derive hasMore whenever the list is a fresh first page (<= one page): an empty
      // inbox (no more), the initial load, or after the client refetches page 1 on
      // reconnect (which resets the cache). A full first page implies more; a short or
      // empty one doesn't. Once paged past the first page, fetchMoreInAppMessages owns it.
      if (nextMessages.length <= IN_APP_MESSAGES_PAGE_SIZE) {
        setHasMore(nextMessages.length === IN_APP_MESSAGES_PAGE_SIZE);
      }
    });
    dashX.watchFetchInAppMessagesAggregate(setUnreadMessagesCount);
  }, [dashX]);

  useEffect(() => {
    // Subscribe to WebSocket messages for in-app messages
    const unsubscribe = subscribe((message: WebsocketMessageType) => {
      // Handle only IN_APP_MESSAGE for toast display
      // The client handles all other message processing internally
      if (message?.type === WebsocketMessage.IN_APP_MESSAGE) {
        toast(message.data.renderedContent.body);
      }
    });

    return unsubscribe;
  }, [subscribe]);

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

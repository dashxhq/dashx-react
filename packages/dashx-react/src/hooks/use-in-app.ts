import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { WebsocketMessage } from '@dashx/browser';
import type { InAppMessages, WebsocketMessageType } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';
import { useWebSocket } from '../providers/DashXProvider.js';

type UseInAppHookResponse = {
  messages: InAppMessages;
  unreadMessagesCount: number | null;
  markMessageAsRead: (id: string) => Promise<any>;
  markMessageAsUnread: (id: string) => Promise<any>;
};

const useInApp = (): UseInAppHookResponse => {
  let dashX = useDashXProvider();
  const { subscribe } = useWebSocket();
  const [messages, setMessages] = useState<InAppMessages>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);

  const markMessageAsRead = (id: string) => dashX.trackMessage({ id, status: 'READ' });

  const markMessageAsUnread = async (id: string) =>
    dashX.trackMessage({ id, status: 'UNREAD' });


  useEffect(() => {
    // Set up in-app message watchers (automatically refetch on WebSocket reconnection)
    dashX.watchFetchInAppMessages(setMessages);
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
    markMessageAsRead,
    markMessageAsUnread,
  };
};

export default useInApp;

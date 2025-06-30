import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { WebsocketMessage } from '@dashx/browser';
import type { InAppNotifications, WebsocketMessageType } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';
import { useWebSocket } from '../providers/DashXProvider.js';

type UseInAppHookResponse = {
  notifications: InAppNotifications;
  unreadNotificationsCount: number | null;
  markNotificationAsRead: (id: string) => Promise<any>;
  markNotificationAsUnread: (id: string) => Promise<any>;
};

const useInApp = (): UseInAppHookResponse => {
  let dashX = useDashXProvider();
  const { subscribe } = useWebSocket();
  const [notifications, setNotifications] = useState<InAppNotifications>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number | null>(null);

  const markNotificationAsRead = (id: string) => dashX.trackNotification({ id, status: 'READ' });

  const markNotificationAsUnread = async (id: string) =>
    dashX.trackNotification({ id, status: 'UNREAD' });


  useEffect(() => {
    // Set up notification watchers (automatically refetch on WebSocket reconnection)
    dashX.watchFetchInAppNotifications(setNotifications);
    dashX.watchFetchInAppNotificationsAggregate(setUnreadNotificationsCount);
  }, [dashX]);

  useEffect(() => {
    // Subscribe to WebSocket messages for notifications
    const unsubscribe = subscribe((message: WebsocketMessageType) => {
      // Handle only IN_APP_NOTIFICATION for toast display
      // The client handles all other message processing internally
      if (message?.type === WebsocketMessage.IN_APP_NOTIFICATION) {
        toast(message.data.renderedContent.body);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markNotificationAsUnread,
  };
};

export default useInApp;

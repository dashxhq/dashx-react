import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket.js';
import { WebsocketMessage } from '@dashx/browser';

import useDashXProvider from './use-dashx-provider.js';

import type { InAppNotifications, WebsocketMessageType } from '@dashx/browser';

type UseInAppHookResponse = {
  notifications: InAppNotifications;
  unreadNotificationsCount: number | null;
  markNotificationAsRead: (id: string) => Promise<any>;
  markNotificationAsUnread: (id: string) => Promise<any>;
};

const DASHX_CLOSE_CODES = [40000, 40001, 50000];

const useInApp = (): UseInAppHookResponse => {
  let dashX = useDashXProvider();
  const [connectWebsocket, setConnectWebsocket] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotifications>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number | null>(null);

  const markNotificationAsRead = (id: string) => dashX.trackNotification({ id, status: 'READ' });

  const markNotificationAsUnread = async (id: string) =>
    dashX.trackNotification({ id, status: 'UNREAD' });

  useEffect(() => {
    dashX.watchFetchInAppNotifications(setNotifications);
    dashX.watchFetchInAppNotificationsAggregate(setUnreadNotificationsCount);
  }, [dashX]);

  let { sendJsonMessage } = useWebSocket(
    dashX.realtimeBaseUri,
    {
      queryParams: {
        publicKey: dashX.publicKey,
        ...(dashX.identityToken && { identityToken: dashX.identityToken }),
        ...(dashX.targetEnvironment && { targetEnvironment: dashX.targetEnvironment }),
      },
      shouldReconnect: (closeEvent) => {
        if (DASHX_CLOSE_CODES.includes(closeEvent.code)) {
          return false;
        }

        return true;
      },
      onError: (errorEvent) => console.error({ errorEvent }),
      onClose: (closeEvent) => console.log({ closeEvent }),
      onMessage: async (messageEvent) => {
        let message: WebsocketMessageType = JSON.parse(messageEvent.data);

        switch (message?.type) {
          case WebsocketMessage.SUBSCRIBE:
            break;
          case WebsocketMessage.IN_APP_NOTIFICATION:
            dashX.trackNotification({ id: message.data.id, status: 'DELIVERED' });
            dashX.addInAppNotificationToCache(message.data);
            toast(message.data.renderedContent.body);
            break;
          case WebsocketMessage.SUBSCRIPTION_SUCCEEDED:
            dashX.fetchInAppNotifications();
            break;
          default:
            throw new Error(`Unknown message type ${message}`);
        }
      },
      /* onOpen: (_) => {
        let subscriptionMessage: WebsocketMessageType = {
          type: WebsocketMessage.SUBSCRIBE,
          data: {
            accountUid: dashX.accountUid!, // accountUid should exist by this point
          },
        };

        sendJsonMessage(subscriptionMessage);
      }, */
    },
    connectWebsocket,
  );

  useEffect(() => {
    setConnectWebsocket(true); // Ensure the webook connection request is made ONLY once
  }, []);

  return {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markNotificationAsUnread,
  };
};

export default useInApp;

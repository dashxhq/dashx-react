import { useEffect, useState } from "react"
import toast from 'react-hot-toast'
import useWebSocket from 'react-use-websocket'
import { WebsocketMessageType } from '@dashx/browser'
import type { InAppNotification, WebsocketMessage } from '@dashx/browser'

import useDashXProvider from "./use-dashx-provider"

type UseInAppHookResponse = {
  notifications: InAppNotification[],
  unreadNotificationsCount: number | null,
  markNotificationAsRead: (id: string) => Promise<Response>,
  markNotificationAsUnread: (id: string) => Promise<Response>,
}

const DASHX_CLOSE_CODES = [
  40000,
  40001,
  50000
]

const useInApp = (): UseInAppHookResponse => {
  let dashX = useDashXProvider()
  const [connectWebsocket, setConnectWebsocket] = useState(false)
  const [notifications, setNotifications] = useState<InAppNotification[]>([])
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number | null>(null)
  const [inAppChannel, setInAppChannel] = useState<string | null>(null)

  const markNotificationAsRead = (id: string) => dashX.trackNotification({ id, status: 'READ' })

  const markNotificationAsUnread = async (id: string): Promise<Response> => dashX.trackNotification({ id, status: 'UNREAD' })

  let { sendJsonMessage } = useWebSocket('ws://localhost:8082/websocket', {
    queryParams: {
      'publicKey': dashX.publicKey,
      ...(dashX.identityToken && { 'identityToken': dashX.identityToken }),
      ...(dashX.targetEnvironment && { 'targetEnvironment': dashX.targetEnvironment })
    },
    shouldReconnect: (closeEvent) => {
      if (DASHX_CLOSE_CODES.includes(closeEvent.code)) {
        console.error(closeEvent.reason)
        return false
      }

      return true
    },
    onError: errorEvent => console.error({ errorEvent }),
    onClose: closeEvent => console.log({ closeEvent }),
    onMessage: (messageEvent) => {
      // @ts-ignore
      let message: WebsocketMessage = {}
      try {
        message = JSON.parse(messageEvent.data)
      } catch(e) {
        console.error(e)
      }

      switch (message?.type) {
        case WebsocketMessageType.SUBSCRIBE:
          break;
        case WebsocketMessageType.IN_APP_NOTIFICATION:
          dashX.trackNotification({ id: message.data.notificationId, status: 'DELIVERED' })
          toast(message.data.body)
          break;
        case WebsocketMessageType.SUBSCRIPTION_SUCCEEDED:
          setInAppChannel(message.data.channel)
          break;
        default:
          console.error('Unknown message type');
      }
    },
    onOpen: (_) => {
      let subscriptionMessage: WebsocketMessage = {
        type: WebsocketMessageType.SUBSCRIBE,
        data: {
          accountUid: dashX.accountUid! // accountUid should exist by this point
        }
      }

      sendJsonMessage(subscriptionMessage)
    },
  }, connectWebsocket);

  useEffect(() => {
    setConnectWebsocket(true) // Ensure the webook connection request is made ONLY once
  }, [])


  useEffect(() => {
    if (inAppChannel) {
      dashX.inAppNotificationsAggregate(inAppChannel)
        .then((response) => setUnreadNotificationsCount(response.notificationsAggregate.count))
        .catch((err)=> console.error(err))

      dashX.fetchInAppNotifications(inAppChannel)
        .then((response) => setNotifications(response.notifications))
        .catch((err)=> console.error(err))
    }
  }, [inAppChannel]);

  return { notifications, unreadNotificationsCount, markNotificationAsRead, markNotificationAsUnread }
}

export default useInApp

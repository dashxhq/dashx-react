import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useWebSocket from 'react-use-websocket'
import { BellIcon } from '@heroicons/react/24/solid'
import { usePopper } from 'react-popper'
import { WebsocketMessageType } from '@dashx/browser'
import { XIcon } from '@heroicons/react/solid'
import type { WebsocketMessage } from '@dashx/browser'

import { useInApp } from '../hooks'

const NotificationBell = () => {
  let { client } = useInApp()
  const [referenceElement, setReferenceElement] = useState<SVGSVGElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end'
  })
  const [isAppInboxOpen, setIsAppInboxOpen] = useState(false)
  const [connectWebsocket, setConnectWebsocket] = useState(false)

  let { sendJsonMessage } = useWebSocket('ws://localhost:8082/websocket', {
    queryParams: {
      'publicKey': client.publicKey,
      ...(client.targetEnvironment && { 'targetEnvironment': client.targetEnvironment })
    },
    shouldReconnect: (_) => true,
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
          client.trackNotification({ id: message.data.notificationId, status: 'DELIVERED' })
          toast(message.data.body)
          break;
        case WebsocketMessageType.INVALID:
          console.error(message.data.message)
          break;
        default:
          console.error('Unknown message type');
      }
    },
    onOpen: (_) => {
      let subscriptionMessage: WebsocketMessage = {
        type: WebsocketMessageType.SUBSCRIBE,
        data: {
          accountUid: client.accountUid! // accountUid should exist by this point
        }
      }

      sendJsonMessage(subscriptionMessage)
    },
  }, connectWebsocket);

  useEffect(() => {
    // Ensure the webook connection request is made ONLY once
    setConnectWebsocket(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <BellIcon
        aria-hidden="true"
        className="h-6 w-6"
        onClick={() =>  setIsAppInboxOpen(!isAppInboxOpen)}
        ref={setReferenceElement}
      />

      {isAppInboxOpen && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="bg-gray-800 rounded-xl text-white w-96 h-96"
        >
          <div className="flex justify-between items-center border-y-2 border-white px-4 py-4">
            <p>Notifications</p>
            <XIcon height={20} width={20} onClick={() =>  setIsAppInboxOpen(false)} />
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default NotificationBell

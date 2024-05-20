import React, { useState } from 'react'
import { BellIcon, EnvelopeIcon, EnvelopeOpenIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { usePopper } from 'react-popper'

import { useInApp } from '../hooks'

const NotificationBell = () => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [referenceElement, setReferenceElement] = useState<SVGSVGElement | null>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end'
  })
  const [isAppInboxOpen, setIsAppInboxOpen] = useState(false)
  let {
    markNotificationAsRead,
    markNotificationAsUnread,
    notifications,
    unreadNotificationsCount
  } = useInApp()

  return (
    <React.Fragment>
      <BellIcon
        aria-hidden="true"
        className={`h-6 w-6 ${unreadNotificationsCount && 'text-red-600'}`}
        onClick={() =>  setIsAppInboxOpen(!isAppInboxOpen)}
        ref={setReferenceElement}
      />

      {isAppInboxOpen && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="bg-gray-800 rounded-xl text-white cursor-default overflow-hidden"
        >
          <div className="flex justify-between items-center border-y-2 border-white px-4 py-2">
            <div className="flex items-center">
              <p>Notifications</p>
              {!!unreadNotificationsCount && <p className="pl-2 text-red-600">{unreadNotificationsCount}</p>}
            </div>
            <XMarkIcon height={20} width={20} className="cursor-pointer" onClick={() =>  setIsAppInboxOpen(false)} />
          </div>
          <div className="h-96 w-96 overflow-scroll">
            {notifications.map((notification) => {
              let sentAt = new Date(notification.sentAt).toLocaleString()

              return (
                <div className="flex justify-between px-4 py-2 [&:not(:last-child)]:border-b-2" key={notification.id}>
                  <p>{notification.renderedContent.body}</p>
                  <div className="flex items-center">
                    <p className="pr-2">{sentAt}</p>
                    {notification.readAt
                      ? <EnvelopeOpenIcon className="h-4 w-4 cursor-pointer" onClick={() => markNotificationAsUnread(notification.id)} />
                      : <EnvelopeIcon className="h-4 w-4 cursor-pointer" onClick={() => markNotificationAsRead(notification.id)} />
                    }
                  </div>
                </div>
              )
            })}
          </div>
          <p className="bold px-4 py-2">Powered by DashX</p>
        </div>
      )}
    </React.Fragment>
  )
}

export default NotificationBell

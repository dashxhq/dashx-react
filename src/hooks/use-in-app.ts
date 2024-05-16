import { useEffect, useState } from "react"
import type { InAppNotificationRecipient, Client } from '@dashx/browser'

import useDashXProvider from "./use-dashx-provider"

type UseInAppHookResponse = {
  notifications: InAppNotificationRecipient[],
  trackNotification: typeof Client.prototype.trackNotification
}

const useInApp = (): UseInAppHookResponse => {
  const dashX = useDashXProvider()
  const [ notifications, setNotifications ] = useState<InAppNotificationRecipient[]>([])

  useEffect(() => {
      dashX.listInAppNotifications()
        .then((response) => setNotifications(response))
        .catch((err)=> console.error(err))
  }, [dashX]);

  return { notifications, trackNotification: dashX.trackNotification }
}

export default useInApp

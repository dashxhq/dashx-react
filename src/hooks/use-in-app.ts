import { useEffect, useState } from "react"
import type { Client, InAppNotificationRecipient } from '@dashx/browser'

import useDashXProvider from "./use-dashx-provider"

type UseInAppHookResponse = {
  client: Client,
  notifications: InAppNotificationRecipient[],
}

const useInApp = (): UseInAppHookResponse => {
  let dashX = useDashXProvider()
  const [ notifications, setNotifications ] = useState<InAppNotificationRecipient[]>([])

  useEffect(() => {
    dashX.listInAppNotifications()
      .then((response) => setNotifications(response))
      .catch((err)=> console.error(err))
  }, [dashX]);

  return { client: dashX, notifications }
}

export default useInApp

import React from "react";
import { Client } from "@dashx/browser"

import { DashXContext } from '../providers/DashXProvider'

const useDashXProvider = (): Client => {
  const context = React.useContext(DashXContext)
  if (!context) {
    throw new Error(
      "DashXProvider not initialized. Make sure your app is wrapped in DashXProvider."
    );
  }

  return context
}

export default useDashXProvider

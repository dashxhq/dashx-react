import React from 'react'
import { Toaster } from 'react-hot-toast'
import type { ToasterProps } from 'react-hot-toast'

type ToastProps = ToasterProps

const Toast = (props: ToastProps) => (
  <React.Fragment>
    <Toaster
      position='top-right'
      {...props}
    />
  </React.Fragment>
)

export default Toast

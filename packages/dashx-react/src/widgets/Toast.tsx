import React from 'react';
import { Toaster } from 'react-hot-toast';

import type { ToasterProps } from 'react-hot-toast';

type ToastProps = ToasterProps;

const Toast = (props: ToastProps) => (
  <React.Fragment>
    <Toaster
      toastOptions={{
        className: 'bg-gray-900 text-white',
      }}
      {...props}
    />
  </React.Fragment>
);

export default Toast;

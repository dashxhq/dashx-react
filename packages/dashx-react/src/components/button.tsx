import * as React from 'react';

import { cn } from '../utils/cn.js';

const Button = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const { className } = props;

    return (
      <button
        className={cn(
          'hover:bg-accent-800 bg-accent-700 shadow-2 hover:shadow-6 rounded-3 px-4 py-2 text-white transition-all sm:px-8 sm:py-3',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };

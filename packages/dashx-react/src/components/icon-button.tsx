import * as React from 'react';

import { cn } from '../utils/cn.js';

const IconButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const { className } = props;

    return (
      <button
        className={cn(
          'hover:bg-accent-300 border-accent-700 rounded-3 text-accent-700 border p-3 transition-all',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

IconButton.displayName = 'Button';

export { IconButton };

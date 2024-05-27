import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../utils/cn.js';

const CardMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const { className } = props;

    return <Slot className={cn('rounded-3', className)} ref={ref} {...props} />;
  },
);

CardMedia.displayName = 'CardMedia';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const { className } = props;

    return (
      <div
        className={cn(
          'shadow-1 hover:shadow-6 rounded-5 flex gap-5 border bg-white p-5 transition-shadow hover:bg-white',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = 'Card';

export { Card, CardMedia };

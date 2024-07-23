import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { SPACING, card } from '../variants/card.js';
import { cn } from '../utils/cn.js';

import type { CardVariantProps } from '../variants/card.js';

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardVariantProps {
  asChild?: boolean;
}
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { asChild, className, spacing = 'medium', roundness, ...rest } = props;
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      {...rest}
      className={cn('dx', card({ className, spacing, roundness }))}
      data-radius={roundness}
      style={{
        // @ts-ignore
        '--padding': SPACING[spacing],
      }}
    />
  );
});

Card.displayName = 'Card';

export { Card };
export type { CardProps };

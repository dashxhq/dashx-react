import React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '../utils/cn.js';

import type { VariantProps } from 'class-variance-authority';

const flexVariants = cva(['flex'], {
  variants: {
    direction: {
      column: ['flex-col'],
      row: ['flex-row'],
    },
    gap: {
      1: ['gap-1'],
      2: ['gap-2'],
      3: ['gap-3'],
      4: ['gap-4'],
      5: ['gap-5'],
      6: ['gap-6'],
    },
    justify: {
      center: ['justify-center'],
    },
  },
});

type FlexProps = VariantProps<typeof flexVariants>;

const Flex = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & FlexProps>(
  (props, ref) => {
    const { className, direction, gap, justify } = props;

    return (
      <div
        className={cn(flexVariants({ direction, gap, justify }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Flex.displayName = 'Flex';

export { Flex };

import React from 'react';
import { tv } from 'tailwind-variants';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../utils/cn.js';

import type { VariantProps } from 'tailwind-variants';

const flexVariants = tv({
  base: 'flex',
  variants: {
    direction: {
      column: ['flex-col'],
      row: ['flex-row'],
    },
    gap: {
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
      10: 'gap-10',
      12: 'gap-12',
      14: 'gap-14',
      16: 'gap-16',
      18: 'gap-18',
      24: 'gap-24',
      28: 'gap-28',
      32: 'gap-32',
    },
    justify: {
      baseline: 'justify-baseline',
      center: 'justify-center',
      between: 'justify-between',
      start: 'justify-start',
      end: 'justify-end',
    },
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      start: 'items-start',
      end: 'items-end',
    },
  },
});

type FlexProps = VariantProps<typeof flexVariants> & {
  asChild?: boolean;
};

const Flex = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & FlexProps>(
  (props, ref) => {
    const { className, direction, gap, justify, align, asChild, ...rest } = props;
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        className={cn(flexVariants({ direction, gap, justify, align }), className)}
        ref={ref}
        {...rest}
      />
    );
  },
);

Flex.displayName = 'Flex';

export type { FlexProps };
export { Flex };

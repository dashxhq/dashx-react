import React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '../utils/cn.js';

import type { VariantProps } from 'class-variance-authority';

const textVariants = cva(['text-gray-700'], {
  variants: {
    size: {
      sm: ['text-sm'],
      lg: ['text-lg'],
    },
  },
});

type TextProps = VariantProps<typeof textVariants>;

const Text = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLParagraphElement> & TextProps
>((props, ref) => {
  const { className, size } = props;

  return <p className={cn(textVariants({ size }), className)} ref={ref} {...props} />;
});

Text.displayName = 'Text';

export { Text };

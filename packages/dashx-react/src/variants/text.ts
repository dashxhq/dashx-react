import { tv } from 'tailwind-variants';

import { typography } from './typography.js';

import type { VariantProps } from 'tailwind-variants';

const text = tv({
  extend: typography,
  base: 'text-gray-950',
  variants: {
    align: {},
    size: {},
    weight: {},
    color: {},
    variant: {},
  },
  defaultVariants: {
    size: 3,
    weight: 'regular',
    color: 'gray',
    variant: 'primary',
  },
});

type TextVariantProps = VariantProps<typeof text>;

export type { TextVariantProps };
export { text };

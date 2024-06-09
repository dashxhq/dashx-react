import { tv, type VariantProps } from 'tailwind-variants';
import { typography } from './typography';

const text = tv({
  extend: typography,
  base: 'text-gray-950',
  variants: {
    size: {}
  },
  defaultVariants: {
    size: 3,
  },
});

type TextVariantProps = VariantProps<typeof text>;

export type { TextVariantProps };
export { text };

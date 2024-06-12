import { tv, type VariantProps } from 'tailwind-variants';
import { typography } from './typography';

const heading = tv({
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
    size: 9,
    weight: 'bold',
    color: 'gray',
    variant: 'primary',
  },
});

type HeadingVariantProps = VariantProps<typeof heading>;

export type { HeadingVariantProps };
export { heading };

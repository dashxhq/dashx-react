import { tv } from 'tailwind-variants';

import type { VariantProps } from 'tailwind-variants';

const SPACING = {
  none: '0',
  small: 'var(--spacing-3)',
  medium: 'var(--spacing-4)',
  large: 'var(--spacing-6)',
  extralarge: 'var(--spacing-8)',
};

const card = tv({
  base: 'shadow-2xs bg-bg light:shadow-gray-400/30 border border-gray-400/40 p-[var(--padding)]',
  variants: {
    roundness: {
      none: 'rounded-none',
      small: 'rounded-md',
      medium: 'rounded-lg',
      large: 'rounded-xl',
      full: 'rounded-full',
    },
    spacing: {
      none: '',
      small: '',
      medium: '',
      large: '',
      extralarge: '',
    },
  },
  defaultVariants: {
    roundness: 'medium',
    spacing: 'medium',
  },
});

type CardVariantProps = VariantProps<typeof card>;

export type { CardVariantProps };
export { card, SPACING };

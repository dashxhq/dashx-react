import { tv } from 'tailwind-variants';

import baseElement from './base-element.js';

import type { VariantProps } from 'tailwind-variants';

const avatar = tv({
  extend: baseElement,
  base: 'inline-flex items-center justify-center outline-none select-none',
  variants: {
    size: {
      extrasmall: 'rounded-sm-or-full text-xs',
      small: 'rounded-sm-or-full text-sm',
      medium: 'rounded-md-or-full text-base',
      large: 'rounded-lg-or-full text-lg',
      extralarge: 'rounded-lg-or-full text-xl',
    },
    roundness: {},
  },
  defaultVariants: {
    size: 'medium',
    mode: 'distinct',
    variant: 'fill',
  }
});

type AvatarVariantProps = VariantProps<typeof avatar>;

export type { AvatarVariantProps };

export { avatar };

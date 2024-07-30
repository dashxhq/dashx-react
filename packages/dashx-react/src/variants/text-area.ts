import { tv } from 'tailwind-variants';

import type { VariantProps } from 'tailwind-variants';
import { baseField } from './base-field.js';

const textArea = tv({
  extend: baseField,
  base: 'leading-3',
  variants: {
    elevation: {},
    roundness: {},
    size: {
      extrasmall: 'rounded-sm',
      small: 'rounded-sm',
      medium: 'rounded-md',
      large: 'rounded-lg',
      extralarge: 'rounded-lg',
    },
  },
});

type TextAreaVariantProps = VariantProps<typeof textArea>;

export type { TextAreaVariantProps };

export { textArea };

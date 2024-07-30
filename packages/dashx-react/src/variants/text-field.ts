import { tv } from 'tailwind-variants';

import { baseField } from './base-field.js';
import type { VariantProps } from 'tailwind-variants';

const textField = tv({
  extend: baseField,
  base: 'py-3 px-4 text-sm text-gray-900',
  variants: {
    size: {
      extrasmall: 'rounded-sm-or-full',
      small: 'rounded-sm-or-full',
      medium: 'rounded-md-or-full',
      large: 'rounded-lg-or-full',
      extralarge: 'rounded-lg-or-full',
    },
    roundness: {},
    elevation: {},
  },
});

type TextFieldVariantProps = VariantProps<typeof textField>;

export type { TextFieldVariantProps };

export { textField };

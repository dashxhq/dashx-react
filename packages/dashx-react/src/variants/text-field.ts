import { tv } from 'tailwind-variants';

import { baseField } from './base-field.js';
import type { VariantProps } from 'tailwind-variants';

const textField = tv({
  extend: baseField,
  base: 'data-[invalid="true"]:border-negative-300 data-[invalid="true"]:hover:border-negative-400 data-[invalid="true"]:focus:border-negative-500 data-[invalid="true"]:text-negative-500 data-[invalid="true"]:bg-negative-50 ease-fluid data-[invalid="true"]:focus:outline-negative-500 focus:outline-accent-500 autofill:bg-accent-300 !hover:border-gray-400 border-gray-300 py-3 px-4 text-sm text-gray-900 outline-none transition-[box-shadow,background-color,color,border-color] duration-300',
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

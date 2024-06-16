import { tv } from 'tailwind-variants';

import baseElement from './base-element.js';

import type { VariantProps } from 'tailwind-variants';

const textField = tv({
  extend: baseElement,
});

type TextFieldVariantProps = VariantProps<typeof textField>;

export type { TextFieldVariantProps };

export { textField };

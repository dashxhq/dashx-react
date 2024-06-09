import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

import baseElement from './base-element';

const textField = tv({
  extend: baseElement
})

type TextFieldVariantProps = VariantProps<typeof textField>;

export type {TextFieldVariantProps}

export {textField}

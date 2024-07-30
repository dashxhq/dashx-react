import { tv } from 'tailwind-variants';

import baseElement from './base-element.js';
import { baseInput } from './base-input.js';

import type { VariantProps } from 'tailwind-variants';

const getSpacing = () => ({
  extrasmall: 'py-[3px] px-2 pr-[calc(var(--spacing-2)+var(--append-padding-right,0px))] text-xs',
  small: 'py-[7px] px-3 pr-[calc(var(--spacing-3)+var(--append-padding-right,0px))] text-xs',
  medium: 'py-[9px] px-4 pr-[calc(var(--spacing-4)+var(--append-padding-right,0px))] text-sm',
  large: 'py-3 px-4 pr-[calc(var(--spacing-4)+var(--append-padding-right,0px))] text-sm',
  extralarge:
    'py-[15px] px-6 pr-[calc(var(--spacing-6)+var(--append-padding-right,0px))] text-base',
});

const baseField = tv({
  extend: baseElement,
  base: baseInput(),
  variants: {
    size: getSpacing(),
    roundness: {
      none: '',
      small: '',
      medium: '',
      large: '',
      full: '',
    },
    elevation: {
      none: '',
      small: '',
      medium: '',
      large: '',
    },
  },
});

type BaseFieldVariantProps = VariantProps<typeof baseField>;

export type { BaseFieldVariantProps };

export { baseField };

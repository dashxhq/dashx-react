import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

import baseElement from './base-element';

const button = tv({
  extend: baseElement,
  base: 'inline-flex items-center justify-center outline-none transition-[box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.25, select-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30',
  variants: {
    size: {
      extrasmall: 'px-2 min-w-14 text-xs',
      small: 'px-3 min-w-16 text-sm',
      medium: 'px-4 min-w-24 text-base',
      large: 'px-6 min-w-28 text-lg',
      extralarge: 'px-6 min-w-32 text-xl',
    },
    variant: {
      fill: 'text-white',
      outline: 'border-2',
      simple: 'border-1 hover:ring-1 hover:ring-inset',
      ghost: '',
    },
    mode: {
      distinct: 'data-[focus-visible]:outline-accent-300',
      subtle: 'data-[focus-visible]:outline-accent-300',
      negative: 'data-[focus-visible]:outline-negative-300',
    },
    roundness: {
      none: '',
      small: '',
      medium: '',
      large: '',
      full: '',
    },
    // TODO: shadow
  },
  defaultVariants: {
    size: 'medium',
    mode: 'distinct',
    variant: 'fill',
  },
  compoundVariants: [
    {
      mode: 'distinct',
      variant: 'fill',
      className:
        'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 shadow-accent-600/30 hover:shadow-accent-600/30 active:shadow-accent-600/30 shadow-sm hover:shadow-lg active:shadow-sm',
    },
    {
      mode: 'distinct',
      variant: 'outline',
      className: 'text-accent-500 hover:text-accent-600 active:text-accent-700',
    },
    {
      mode: 'distinct',
      variant: 'simple',
      className:
        'text-accent-500 hover:text-accent-600 active:text-accent-700 hover:ring-accent-600 active:ring-accent-700',
    },
    {
      mode: 'distinct',
      variant: 'ghost',
      className:
        'text-accent-500 hover:text-accent-600 active:text-accent-700 hover:bg-accent-100 active:bg-accent-200',
    },
    {
      mode: 'subtle',
      variant: 'fill',
      className:
        'bg-gray-500 shadow-sm shadow-gray-600/30 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-600/30 active:bg-gray-700 active:shadow-sm active:shadow-gray-600/30',
    },
    {
      mode: 'subtle',
      variant: 'outline',
      className: 'text-gray-500 hover:text-gray-600 active:text-gray-700',
    },
    {
      mode: 'subtle',
      variant: 'simple',
      className:
        'text-gray-500 hover:text-gray-600 hover:ring-gray-600 active:text-gray-700 active:ring-gray-700',
    },
    {
      mode: 'subtle',
      variant: 'ghost',
      className:
        'text-gray-500 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200 active:text-gray-700',
    },
    {
      mode: 'negative',
      variant: 'fill',
      className:
        'bg-negative-500 hover:bg-negative-600 active:bg-negative-700 shadow-negative-600/30 hover:shadow-negative-600/30 active:shadow-negative-600/30 shadow-sm hover:shadow-lg active:shadow-sm',
    },
    {
      mode: 'negative',
      variant: 'outline',
      className: 'text-negative-500 hover:text-negative-600 active:text-negative-700',
    },
    {
      mode: 'negative',
      variant: 'simple',
      className:
        'text-negative-500 hover:text-negative-600 hover:ring-negative-600 active:text-negative-700 active:ring-negative-700',
    },
    {
      mode: 'negative',
      variant: 'ghost',
      className:
        'text-negative-500 hover:bg-negative-100 hover:text-negative-600 active:bg-negative-200 active:text-negative-700',
    },
  ],
});

type ButtonVariantProps = VariantProps<typeof button>;

export type {ButtonVariantProps}

export {button}
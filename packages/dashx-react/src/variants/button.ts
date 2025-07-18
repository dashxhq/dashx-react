import { tv } from 'tailwind-variants';

import baseElement from './base-element.js';

import type { VariantProps } from 'tailwind-variants';

const button = tv({
  extend: baseElement,
  base: 'ease-fluid inline-flex items-center justify-center gap-2 outline-none transition-[box-shadow,background-color,color] duration-300 select-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:shadow-none',
  variants: {
    size: {
      extrasmall: 'rounded-sm-or-full text-xs',
      small: 'rounded-sm-or-full text-sm',
      medium: 'rounded-md-or-full text-base',
      large: 'rounded-lg-or-full text-lg',
      extralarge: 'rounded-lg-or-full text-xl',
    },
    variant: {
      fill: 'text-bg',
      outline: 'ring-2 ring-inset',
      simple: 'ring-1 ring-inset hover:ring-2 data-[focus-visible]:ring-2',
      ghost: '',
    },
    mode: {
      distinct: 'data-[focus-visible]:outline-accent-500',
      subtle: 'data-[focus-visible]:outline-accent-500',
      negative: 'data-[focus-visible]:outline-negative-500',
    },
    roundness: {},
    elevation: {},
    shape: {
      square: '',
      rect: '',
    },
    inset: {
      left: '',
      right: '',
      both: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    mode: 'distinct',
    variant: 'fill',
    shape: 'rect',
  },
  compoundVariants: [
    {
      mode: 'distinct',
      variant: 'fill',
      className:
        'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 shadow-accent-400/30 hover:shadow-accent-400/30 active:shadow-accent-400/30',
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
        'bg-gray-600 shadow-gray-400/30 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-400/30 active:bg-gray-700 active:shadow-gray-400/30',
    },
    {
      mode: 'subtle',
      variant: 'outline',
      className: 'text-gray-600 hover:text-gray-600 active:text-gray-700',
    },
    {
      mode: 'subtle',
      variant: 'simple',
      className:
        'text-gray-600 hover:text-gray-600 hover:ring-gray-600 active:text-gray-700 active:ring-gray-700',
    },
    {
      mode: 'subtle',
      variant: 'ghost',
      className:
        'text-gray-600 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200 active:text-gray-700',
    },
    {
      mode: 'negative',
      variant: 'fill',
      className:
        'bg-negative-500 hover:bg-negative-600 active:bg-negative-700 shadow-negative-400/30 hover:shadow-negative-400/30 active:shadow-negative-400/30',
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

    {
      shape: 'rect',
      size: 'extrasmall',
      className:
        'min-w-14 px-2 data-[inset=left]:-ml-2 data-[inset=right]:-mr-2 data-[inset=both]:-mx-2',
    },
    {
      shape: 'rect',
      size: 'small',
      className:
        'min-w-16 px-3 data-[inset=left]:-ml-3 data-[inset=right]:-mr-3 data-[inset=both]:-mx-3',
    },
    {
      shape: 'rect',
      size: 'medium',
      className:
        'min-w-24 px-4 data-[inset=left]:-ml-4 data-[inset=right]:-mr-4 data-[inset=both]:-mx-4',
    },
    {
      shape: 'rect',
      size: 'large',
      className:
        'min-w-24 px-6 data-[inset=left]:-ml-6 data-[inset=right]:-mr-6 data-[inset=both]:-mx-6',
    },
    {
      shape: 'rect',
      size: 'extralarge',
      className:
        'min-w-32 px-6 data-[inset=left]:-ml-6 data-[inset=right]:-mr-6 data-[inset=both]:-mx-6',
    },
    {
      shape: 'square',
      size: 'extrasmall',
      className:
        'size-6 p-1 data-[inset=left]:-ml-1 data-[inset=right]:-mr-1 data-[inset=both]:-mx-1',
    },
    {
      shape: 'square',
      size: 'small',
      className:
        'size-8 p-2 data-[inset=left]:-ml-2 data-[inset=right]:-mr-2 data-[inset=both]:-mx-2',
    },
    {
      shape: 'square',
      size: 'medium',
      className:
        'size-10 p-3 data-[inset=left]:-ml-3 data-[inset=right]:-mr-3 data-[inset=both]:-mx-3',
    },
    {
      shape: 'square',
      size: 'large',
      className:
        'size-12 p-4 data-[inset=left]:-ml-4 data-[inset=right]:-mr-4 data-[inset=both]:-mx-4',
    },
    {
      shape: 'square',
      size: 'extralarge',
      className:
        'size-14 p-5 data-[inset=left]:-ml-5 data-[inset=right]:-mr-5 data-[inset=both]:-mx-5',
    },

    {
      size: 'extrasmall',
      variant: 'fill',
      className: 'shadow-2xs active:shadow-2xs hover:shadow-sm',
    },
    {
      size: 'small',
      variant: 'fill',
      className: 'shadow-2xs active:shadow-2xs hover:shadow-sm',
    },
    {
      size: 'medium',
      variant: 'fill',
      className: 'shadow-xs hover:shadow-md active:shadow-xs',
    },
    {
      size: 'large',
      variant: 'fill',
      className: 'shadow-sm hover:shadow-lg active:shadow-sm',
    },
    {
      size: 'extralarge',
      variant: 'fill',
      className: 'shadow-sm hover:shadow-lg active:shadow-sm',
    },
  ],
});

type ButtonVariantProps = VariantProps<typeof button>;

export type { ButtonVariantProps };

export { button };

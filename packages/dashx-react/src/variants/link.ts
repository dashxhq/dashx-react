import { tv } from 'tailwind-variants';

import { text } from './text.js';

import type { VariantProps } from 'tailwind-variants';

const link = tv({
  extend: text,
  base: 'ease-fluid underline-offset-2 outline-none transition-[opacity,color] duration-300 hover:opacity-100 data-[focus-visible]:opacity-100 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  variants: {
    align: {},
    size: {},
    weight: {},
    color: {
      accent: 'data-[focus-visible]:outline-accent-500 decoration-accent-500',
      gray: 'data-[focus-visible]:outline-accent-500 decoration-gray-500',
      negative: 'data-[focus-visible]:outline-negative-500 decoration-negative-500',
    },
    variant: {},
    transform: {},
    underline: {
      always: 'underline decoration-2',
      hover: 'decoration-0 hover:underline hover:decoration-2',
      none: 'decoration-0',
    },
  },
  defaultVariants: {
    underline: 'always',
  },
});

type LinkVariantProps = VariantProps<typeof link>;

export type { LinkVariantProps };
export { link };

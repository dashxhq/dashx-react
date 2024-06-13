import { tv } from 'tailwind-variants';

import type { VariantProps } from 'tailwind-variants';

const typography = tv({
  base: 'text-gray-950',
  variants: {
    align: {
      center: 'text-center',
      left: 'text-left',
      right: 'text-right',
      justify: 'text-justify',
      balance: 'text-balance',
      pretty: 'text-pretty',
    },
    size: {
      1: 'text-xs',
      2: 'text-sm',
      3: 'text-base',
      4: 'text-lg',
      5: 'text-xl',
      6: 'text-2xl',
      7: 'text-3xl',
      8: 'text-4xl',
      9: 'text-5xl',
      10: 'text-6xl',
      11: 'text-7xl',
      12: 'text-8xl',
      13: 'text-9xl',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      accent: '',
      gray: '',
      negative: '',
    },
    variant: {
      primary: '',
      secondary: '',
      tertiary: '',
    },
  },
  compoundVariants: [
    {
      color: 'accent',
      variant: 'primary',
      className: 'text-accent-950',
    },
    {
      color: 'accent',
      variant: 'secondary',
      className: 'text-accent-900',
    },
    {
      color: 'accent',
      variant: 'tertiary',
      className: 'text-accent-800',
    },
    {
      color: 'gray',
      variant: 'primary',
      className: 'text-gray-950',
    },
    {
      color: 'gray',
      variant: 'secondary',
      className: 'text-gray-900',
    },
    {
      color: 'gray',
      variant: 'tertiary',
      className: 'text-gray-800',
    },
    {
      color: 'negative',
      variant: 'primary',
      className: 'text-negative-950',
    },
    {
      color: 'negative',
      variant: 'secondary',
      className: 'text-negative-900',
    },
    {
      color: 'negative',
      variant: 'tertiary',
      className: 'text-negative-800',
    },
  ],
});

type TypographyVariantProps = VariantProps<typeof typography>;

export type { TypographyVariantProps };
export { typography };

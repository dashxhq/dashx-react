import { tv, type VariantProps } from 'tailwind-variants';

const typography = tv({
  base: 'text-gray-950',
  variants: {
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
  },
  defaultVariants: {
    size: 3,
  },
});

type TextVariantProps = VariantProps<typeof typography>;

export type { TextVariantProps };
export { typography };

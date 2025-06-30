import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';
import { baseInput } from './base-input.js';

const checkbox = tv({
  extend: baseInput,
  base: 'data-[focus-visible]:outline-accent-500',
  variants: {
    size: {
      small: 'my-[1px] size-[14px] rounded-sm p-[1px]',
      medium: 'my-[2px] size-4 rounded-md p-[2px]',
      large: 'size-6 rounded-lg p-1',
    },
    roundness: {
      none: '',
      small: '',
      medium: '',
      large: '',
    },
    elevation: {
      none: '',
      small: '',
      medium: '',
      large: '',
    },
  },
});

type CheckboxVariantProps = VariantProps<typeof checkbox>;

export type { CheckboxVariantProps };

export { checkbox };

import { tv } from 'tailwind-variants';

import type { VariantProps } from 'tailwind-variants';

const baseInput = tv({
  base: 'bg-white data-[invalid="true"]:border-negative-300 data-[invalid="true"]:hover:border-negative-400 data-[invalid="true"]:focus:border-negative-500 data-[invalid="true"]:text-negative-500 data-[invalid="true"]:bg-negative-50 ease-fluid data-[invalid="true"]:focus:outline-negative-500 focus:outline-accent-500 autofill:bg-accent-300 !hover:border-gray-400 border border-gray-300 py-3 px-4 text-sm text-gray-900 outline-none transition-[box-shadow,background-color,color,border-color] duration-300',
});

type BaseInputVariantProps = VariantProps<typeof baseInput>;

export type { BaseInputVariantProps };

export { baseInput };

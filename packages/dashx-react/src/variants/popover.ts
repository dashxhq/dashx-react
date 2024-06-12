import { tv, type VariantProps } from 'tailwind-variants';

const popover = tv({
  base: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 overflow-hidden bg-white shadow-md shadow-gray-400/30 outline-0',
  variants: {
    roundness: {
      none: 'rounded-none',
      small: 'rounded-sm',
      medium: 'rounded-md',
      large: 'rounded-xl',
      full: 'rounded-full',
    },
    spacing: {
      small: '',
      medium: '',
      large: '',
      extralarge: '',
    },
  },
  defaultVariants: {
    roundness: 'medium',
  },
});

type PopoverVariantProps = VariantProps<typeof popover>;

const popoverBody = tv({
  base: 'bg-gray-50 p-[var(--padding)]',
});

const popoverHeader = tv({
  base: 'border-b border-b-gray-100 p-[var(--padding)]',
});

const popoverFooter = tv({
  base: 'border-t border-t-gray-100 p-[var(--padding)]',
});

export type { PopoverVariantProps };
export { popover, popoverBody, popoverHeader, popoverFooter };

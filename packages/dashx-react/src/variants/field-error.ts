import { tv } from 'tailwind-variants';

const fieldError = tv({
  base: 'bg-negative-500 absolute top-[75%] z-[1] transform text-white',
  variants: {
    size: {
      extrasmall: 'rounded-sm-or-full shadow-negative-600/30 left-3 py-1 px-2 shadow-xs',
      small: 'rounded-sm-or-full shadow-negative-600/30 left-3 py-1 px-2 shadow-xs',
      medium: 'rounded-sm-or-full shadow-negative-600/30 left-4 py-2 px-3 shadow-sm',
      large: 'rounded-md-or-full shadow-negative-600/30 left-4 py-3 px-4 shadow-md',
      extralarge: 'rounded-md-or-full shadow-negative-600/30 left-6 py-3 px-4 shadow-md',
    },
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

export { fieldError };

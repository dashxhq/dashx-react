import { tv } from 'tailwind-variants';

const baseElement = tv({
  variants: {
    size: {
      extrasmall: 'h-6',
      small: 'h-8',
      medium: 'h-10',
      large: 'h-12',
      extralarge: 'h-14',
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

export default baseElement;

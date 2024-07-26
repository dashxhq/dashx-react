import { tv } from 'tailwind-variants';

const baseElement = tv({
  variants: {
    size: {
      extrasmall: 'rounded-sm-or-full h-6',
      small: 'rounded-sm-or-full h-8',
      medium: 'rounded-md-or-full h-10',
      large: 'rounded-lg-or-full h-12',
      extralarge: 'rounded-lg-or-full h-14',
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

import { tv } from "tailwind-variants";

const baseElement = tv({
  variants: {
    size: {
      extrasmall: 'h-6 rounded-sm',
      small: 'h-8 rounded-sm',
      medium: 'h-10 rounded-md',
      large: 'h-12 rounded-lg',
      extralarge: 'h-14 rounded-lg',
    },
  }
})

export default baseElement
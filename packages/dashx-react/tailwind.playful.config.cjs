const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,jsx,js}"],
  important: '.dr',
  plugins: [
    require('tailwindcss-react-aria-components')
  ],
  theme: {
    extend: {
      colors: {
        "accent": colors.purple
      },
      boxShadow: {
        0: '0 0 #0000',
        1: '0 0 #0000',
        2: '0 0 #0000',
        3: '0 0 #0000',
        4: '0 0 #0000',
        5: '0 0 #0000',
        6: '0 0 #0000'
      },
      borderRadius: {
        0: 0,
        1: '16px',
        2: '24px',
        3: '32px',
        4: '40px',
        5: '48px',
        6: '64px'
      }
    },
  },
  plugins: [],
}
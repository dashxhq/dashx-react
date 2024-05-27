const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{tsx,jsx,js}", "../../packages/dashx-react/dist/cjs/components/**/*.{tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        "accent": colors.cyan
      },
      boxShadow: {
        '0': '0 0 #0000',
        '1': '1px 1px 0 0 #000',
        '2': '2px 2px 0 0 #000',
        '3': '3px 3px 0 0 #000',
        '4': '4px 4px 0 0 #000',
        '5': '5px 4px 0 0 #000',
        '6': '6px 6px 0 0 #000',
      },
      borderRadius: {
        '0': '0',
        '1': '0',
        '2': '0',
        '3': '0',
        '4': '0',
        '5': '0',
        '6': '0'
      }
    },
  },
  plugins: [],
}
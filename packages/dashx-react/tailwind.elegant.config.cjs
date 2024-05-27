const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,jsx,js}"],
  important: '.dx-ui',
  theme: {
    extend: {
      colors: {
        "accent": colors.gray
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
        1: '0',
        2: '0',
        3: '0',
        4: '0',
        5: '0',
        6: '0'
      }
    },
  },
  plugins: [],
}
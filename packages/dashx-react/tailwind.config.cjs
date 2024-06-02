/** @type {import('tailwindcss').Config} */

module.exports = {
  // TODO: Do something about preflight
  // As a library we shouldn't be applying css reset globally
  // corePlugins: {
  //   preflight: false,
  // },
  content: ["./src/**/*.{tsx,jsx,js}"],
  important: '.dr',
  plugins: [
    require('tailwindcss-react-aria-components')
  ],
  theme: {
    extend: {
      colors: {
        "accent": {
          DEFAULT: '#58efb1'
        }
      },
      boxShadow: {
        '0': '0 0 #0000',
        '1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '2': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '3': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '4': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '5': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '6': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      borderRadius: {
        '0': '0',
        '1': '2px',
        '2': '4px',
        '3': '6px',
        '4': '8px',
        '5': '10px',
        '6': '12px'
      }
    },
  },
  plugins: [],
}
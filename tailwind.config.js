import { fontFamily } from 'tailwindcss/defaultTheme'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter var', ...fontFamily.sans]
      }
    },
  },
  plugins: [],
}

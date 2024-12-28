/** @type {import('tailwindcss').Config} */
const content =[
  './index.html',
  './src/**/*.{vue,js,ts,jsx,tsx}',
]
export default {
  content,
  theme: {
    extend: {
      colors: {
          'primary': {
            light: '#7BFCFF',
            DEFAULT: '#00F0FF',
            dark: '#00B7FF',
          },
          sidebar: '#111827',
          accent: '#18181B',
        }
    }
  },
  plugins: [],
}

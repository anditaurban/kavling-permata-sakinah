/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f472b6',
          400: '#e11d48',
          500: '#be123c',
          600: '#9f1239',
          700: '#881337',
          800: '#4c0519',
          900: '#3b0716',
        },
        primary: {
          DEFAULT: '#be185d',
          hover: '#9d174d',
          light: '#fdf2f8',
          dark: '#831843',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f8fafc',
          muted: '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#cbd5e1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

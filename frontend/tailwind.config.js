/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FCF9F2',
          100: '#F7EEDC',
          200: '#EDD7AD',
          300: '#DFBC77',
          400: '#CFA44C',
          500: '#C59B27', // Brand Primary Gold
          600: '#A87D17',
          700: '#855F14',
          800: '#624312',
          900: '#3E290B',
        },
        sand: {
          50: '#FDFBF7',
          100: '#FBF8F2', // Primary Canvas
          200: '#F4ECE1',
          300: '#ECE0D0',
          400: '#DFCEB7',
          500: '#CDB79B',
        },
        luxury: {
          dark: '#1C1917',
          charcoal: '#26221F',
          muted: '#78716C',
          border: '#E8DFC8',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(197, 155, 39, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'luxury-hover': '0 10px 25px -3px rgba(197, 155, 39, 0.2), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}

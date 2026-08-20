/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#ECEEF0',
          dark: '#09090B',
          cardLight: '#FFFFFF',
          cardDark: '#141416',
          subLight: '#F4F5F7',
          subDark: '#1C1C1F',
        },
        border: {
          light: '#D4D4D8',
          lightSubtle: '#E4E4E7',
          dark: '#27272A',
          darkSubtle: '#1C1C1F',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

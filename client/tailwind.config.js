/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF9FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7', // Secondary: Purple
          600: '#7C3AED', // Primary: Violet
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Accent: Warm amber
          600: '#D97706',
          700: '#B45309',
        },
        surface: {
          bg: '#FAF9FF',     // Background: Soft lavender-white
          card: '#FFFFFF',   // Cards: White
        },
        ink: {
          primary: '#18181B',   // Text: Main text
          secondary: '#71717A', // Secondary text
          muted: '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

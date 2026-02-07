import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['IRANSans', 'Vazirmatn', 'sans-serif'],
        'burgerland': ['IRANSans', 'Vazirmatn', 'sans-serif'],
      },
      colors: {
        // Burgerland color scheme
        'burgerland': {
          'black': '#000000',
          'white': '#ffffff',
          'gray': '#f9fafb',
          'gray-light': '#e5e5e5',
          'gray-dark': '#444',
          'yellow': '#f59e0b', // Approximate yellow color
        },
        // Override default colors
        primary: '#000000',
        secondary: '#f9fafb',
        accent: '#e5e5e5',
      },
      animation: {
        'spin': 'spin 0.8s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(720deg)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config
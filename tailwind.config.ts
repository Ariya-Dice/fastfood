import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './App.tsx',
    './LoadingSpinner.tsx',
    './index.tsx',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
        burgerland: ['Vazirmatn', 'sans-serif'],
      },
      colors: {
        burgerland: {
          black: '#000000',
          white: '#ffffff',
          gray: '#f9fafb',
          'gray-light': '#e5e5e5',
          'gray-dark': '#444',
          yellow: '#f59e0b',
        },
        primary: '#000000',
        secondary: '#f9fafb',
        accent: '#e5e5e5',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(720deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(3rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        spin: 'spin 0.8s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;

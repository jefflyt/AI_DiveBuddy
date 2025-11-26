/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#e6f7ff',
          100: '#b3e5ff',
          200: '#80d4ff',
          300: '#4dc3ff',
          400: '#1ab2ff',
          500: '#0099e6',
          600: '#0077b3',
          700: '#005580',
          800: '#00334d',
          900: '#00121a',
        },
        coral: {
          50: '#fff5f0',
          100: '#ffe0d1',
          200: '#ffccb3',
          300: '#ffb894',
          400: '#ffa375',
          500: '#ff8f57',
          600: '#cc7245',
          700: '#995634',
          800: '#663922',
          900: '#331d11',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

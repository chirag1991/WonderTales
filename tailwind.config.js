/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(148, 163, 184, 0.2), 0 10px 40px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
}

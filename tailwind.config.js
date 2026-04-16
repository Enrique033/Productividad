/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- SI ESTO NO ESTÁ, NADA FUNCIONA
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
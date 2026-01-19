/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1f2e',
        'dark-card': '#151a27',
        'dark-border': '#2a3142',
      }
    },
  },
  plugins: [],
}

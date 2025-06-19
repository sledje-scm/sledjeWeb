/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
 theme: {
  extend: {
    fontFamily: {
      eudoxus: ['Eudoxus Sans', 'sans-serif'],
    },
    colors: {
      blackPrimary: '#0D0D0D',
      greyText: '#6E6E73',
      cardBorder: '#E5E7EB',
    }
  }
},
  plugins: [],
};
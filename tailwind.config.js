/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFA07A',
        textColor: '#FFFFFF',
        background: '#121212',
        cardBackground: '#1E1E1E',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],  // Add Poppins font
        fredoka: ['Fredoka One', 'cursive'], // Add Fredoka One font
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
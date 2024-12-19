/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        backgroundBlue: '#090B31',
        backgroundCream: '#CFC9C9',
        customWhite: '#ffffff',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        ibmPlex: ['IBM Plex Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        avenirBold: ['Avenir', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


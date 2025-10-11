/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f1ead7",
        secondary: "#b8d6d0",
      },
    },
  },
  plugins: [],
};

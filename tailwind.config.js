/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#1E88E5',
        'medical-green': '#43A047',
        'medical-orange': '#FB8C00',
        'medical-red': '#E53935',
      },
    },
  },
  plugins: [],
}

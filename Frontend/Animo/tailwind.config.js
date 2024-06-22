/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'landing-gradient': 'linear-gradient(to bottom, #e5e7eb, #bacef1, #a3c1f4, #89b5f7, #76aaf8, #62a0f8, #4b95f8, #3d89f6, #317df3, #2870f0, #2563eb)'
      }
    },
  },
  plugins: [],
}
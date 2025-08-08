/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          whatsapp: {
            light: '#25D366',
            dark: '#46cd41',
            bg: '#ECE5DD',
            sent: '#DCF8C6'
          }
        },
        fontFamily: {
          sans: ['Helvetica Neue', 'Arial', 'sans-serif']
        }
      }
    },
    plugins: [],
  }
  
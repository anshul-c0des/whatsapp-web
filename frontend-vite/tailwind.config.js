/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          whatsapp: {
            light: '#25D366',
            dark: '#075E54',
            bg: '#ECE5DD',
            sent: '#DCF8C6'
          }
        },
        fontFamily: {
          sans: ['Roboto', 'Helvetica Neue', 'sans-serif']
        }
      }
    },
    plugins: [],
  }
  
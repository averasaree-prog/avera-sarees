/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        avera: {
          button: '#800020',       // User requested: #800020 - BUTTONS
          'button-hover': '#66001A',
          text: '#E8D5BC',         // User requested: #E8D5BC - TEXT / Accents
          heading: '#302820',      // User requested: #302820 - HEADING (BORDER)
          border: '#302820',
          bg: '#F9F6F0',           // Warm heritage cream background from mockup
          card: '#FFFDF9',
          gold: '#C59B27',
          ochre: '#D4A346',
          teal: '#1B6A78',
          maroon: '#800020',
          darkMaroon: '#4E0013',
        },
        maroon: {
          50: '#FDF2F4',
          100: '#FBE8EB',
          500: '#A41D38',
          800: '#800020',
          900: '#4E0013',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#EBDDCB',
          300: '#E8D5BC',
        },
        espresso: {
          800: '#302820',
          900: '#201A14',
        },
        charcoal: {
          700: '#423A32',
          800: '#302820',
          900: '#1F1A14',
        },
        gold: {
          50: '#FBF8EE',
          100: '#F7F0D6',
          200: '#F3E5BE',
          300: '#EBD496',
          400: '#E0C16C',
          500: '#C59B27',
          600: '#A47D1C',
          700: '#7E5E14',
          800: '#5A420F',
          900: '#3A2A0A',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

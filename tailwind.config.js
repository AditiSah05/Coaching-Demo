/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#062B40',
          deep: '#062B40',
          dark: '#041E2E',
          light: '#0C4260',
        },
        sea: {
          blue: '#20C9B5',
          light: '#E3F8F5',
          dark: '#15A494',
        },
        terracotta: {
          DEFAULT: '#F6C65B',
          hover: '#E5B03F',
          light: '#FEF6DD',
        },
        gold: {
          DEFAULT: '#F6C65B',
          hover: '#E5B03F',
          light: '#FEF6DD',
        },
        ivory: {
          DEFAULT: '#F8F5ED',
          card: '#FFFFFF',
          dark: '#EEE7D5',
        },
        ink: '#0F2A3A',
        goldtext: '#B8860B',
        seagreen: {
          DEFAULT: '#20A898',
          light: '#E3F8F5',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Poppins', 'DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'chunky': '0 10px 25px -5px rgba(6, 43, 64, 0.12), 0 8px 10px -6px rgba(6, 43, 64, 0.08)',
        'chunky-lg': '0 20px 35px -10px rgba(6, 43, 64, 0.18), 0 10px 15px -8px rgba(6, 43, 64, 0.12)',
        'terracotta': '0 10px 25px -5px rgba(246, 198, 91, 0.35)',
        'sea': '0 10px 25px -5px rgba(32, 201, 181, 0.3)',
      }
    },
  },
  plugins: [],
}

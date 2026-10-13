/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2545',
          deep: '#0B2545',
          dark: '#07182D',
          light: '#134074',
        },
        sea: {
          blue: '#13A0C9',
          light: '#E6F6FB',
          dark: '#0E7A9B',
        },
        terracotta: {
          DEFAULT: '#E4572E',
          hover: '#CD421A',
          light: '#FDF0EC',
        },
        gold: {
          DEFAULT: '#F2B632',
          hover: '#E0A31B',
          light: '#FEF8E9',
        },
        ivory: {
          DEFAULT: '#FBF6EC',
          card: '#FFFFFF',
          dark: '#F3E8D3',
        },
        ink: '#14213D',
        seagreen: {
          DEFAULT: '#2A9D8F',
          light: '#EAF6F4',
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
        'chunky': '0 10px 25px -5px rgba(11, 37, 69, 0.12), 0 8px 10px -6px rgba(11, 37, 69, 0.08)',
        'chunky-lg': '0 20px 35px -10px rgba(11, 37, 69, 0.18), 0 10px 15px -8px rgba(11, 37, 69, 0.12)',
        'terracotta': '0 10px 25px -5px rgba(228, 87, 46, 0.3)',
        'sea': '0 10px 25px -5px rgba(19, 160, 201, 0.3)',
      }
    },
  },
  plugins: [],
}

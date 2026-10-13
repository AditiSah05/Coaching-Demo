/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#021527',
          deep: '#021527',
          dark: '#010E1B',
          light: '#0B2C4A',
        },
        sea: {
          blue: '#BFA888',
          light: '#F3EDE2',
          dark: '#A68F6D',
        },
        terracotta: {
          DEFAULT: '#BFA888',
          hover: '#A68F6D',
          light: '#F3EDE2',
        },
        gold: {
          DEFAULT: '#BFA888',
          hover: '#A68F6D',
          light: '#F3EDE2',
        },
        ivory: {
          DEFAULT: '#F4F2ED',
          card: '#FFFFFF',
          dark: '#E8E3D8',
        },
        ink: '#3A3A3A',
        goldtext: '#7A6340',
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
        '2xl': '14px',
        '3xl': '20px',
        '4xl': '28px',
      },
      boxShadow: {
        'chunky': '0 1px 2px rgba(2, 21, 39, 0.04), 0 12px 32px -12px rgba(2, 21, 39, 0.14)',
        'chunky-lg': '0 2px 4px rgba(2, 21, 39, 0.05), 0 28px 56px -20px rgba(2, 21, 39, 0.25)',
        'terracotta': '0 10px 25px -5px rgba(191, 168, 136, 0.35)',
        'sea': '0 10px 25px -5px rgba(191, 168, 136, 0.3)',
      }
    },
  },
  plugins: [],
}

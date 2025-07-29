import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        'brand-background': '#131316', // Darker charcoal
        'brand-surface': '#1C1C21',   // Component backgrounds
        'brand-card': '#25252B',      // Cards and modals
        'brand-border': '#36363C',   // Subtle borders
        'brand-primary': {
          DEFAULT: '#4A80F0',         // Main blue
          'hover': '#3D6BDC'          // Darker hover state
        },
        'brand-secondary': {
          DEFAULT: '#4A4A52',         // A more visible gray
          'hover': '#606069'          // Lighter gray for hover
        },
        'brand-text-primary': '#F0F2F5',   // Off-white for main text
        'brand-text-secondary': '#A8ADB7', // Lighter gray for secondary text
        'brand-danger': {
          DEFAULT: '#E5484D',
          'hover': '#C13E42'
        }
      },
       animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
export default config
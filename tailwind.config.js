import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4332',
          50: '#F0F7F4',
          100: '#D1E7DD',
          200: '#B3D7C7',
          300: '#95C7B1',
          400: '#77B79B',
          500: '#52A27D',
          600: '#1B4332',
          700: '#163829',
          800: '#102D20',
          900: '#0B2217',
        },
        secondary: {
          DEFAULT: '#95C7B1',
          50: '#FFFFFF',
          100: '#F5F9F7',
          200: '#E1EDE7',
          300: '#CDE1D7',
          400: '#B9D5C7',
          500: '#95C7B1',
          600: '#6DB391',
          700: '#4B9A75',
          800: '#3A7659',
          900: '#29523E',
        },
        accent: {
          DEFAULT: '#D4A373',
          light: '#E6C9A8',
          dark: '#A67B54',
        },
        neutral: {
          DEFAULT: '#1F2937',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        arabic: ['Noto Naskh Arabic', 'serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#1B4332",
          secondary: "#95C7B1",
          accent: "#D4A373",
          neutral: "#1F2937",
          "base-100": "#FFFFFF",
          "base-200": "#F9FAFB",
          "base-300": "#F3F4F6",
        },
      },
    ],
  },
} 
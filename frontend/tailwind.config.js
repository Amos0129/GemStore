/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766'
        },
        secondary: {
          50: '#f6ffed',
          100: '#d9f7be',
          200: '#b7eb8f',
          300: '#95de64',
          400: '#73d13d',
          500: '#52c41a',
          600: '#389e0d',
          700: '#237804',
          800: '#135200',
          900: '#092b00'
        },
        dark: {
          50: '#f7f7f8',
          100: '#eeeff1',
          200: '#d5d7dc',
          300: '#b3b7c1',
          400: '#8a909e',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        accent: {
          blue: '#00d4ff',
          cyan: '#00ffaa'
        },
        background: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          card: 'rgba(22, 33, 62, 0.6)'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-strong': '0 0 30px rgba(0, 212, 255, 0.5)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}
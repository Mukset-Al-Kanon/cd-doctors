/** @type {import('tailwind-css').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nuvicaNavy: {
          50: '#f0f4fa',
          100: '#d9e2f2',
          500: '#1d4ed8',
          600: '#1e3a8a',
          800: '#0f2b5c',
          900: '#0a192f',
          950: '#060d1a',
        },
        nuvicaMint: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          accent: '#00e676',
        },
        nuvicaIce: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
        },
        medical: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#0f2b5c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'nuvica': '0 20px 50px -12px rgba(15, 43, 92, 0.12)',
        'glass-nuvica': '0 8px 32px 0 rgba(14, 165, 233, 0.1)',
        'card-glow': '0 10px 30px -5px rgba(34, 197, 94, 0.15)',
      },
      borderRadius: {
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [],
};

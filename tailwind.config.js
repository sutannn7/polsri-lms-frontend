/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056B3',
          dark: '#003D82',
          soft: '#EDF5FF',
        },
        accent: '#FFC107',
        background: '#F8F9FA',
        main: '#1F2937',
        secondary: '#6B7280',
        border: '#E5E7EB',
        success: {
          DEFAULT: '#16A34A',
          badge: '#DCFCE7',
          text: '#166534',
        },
        danger: {
          DEFAULT: '#DC2626',
          badge: '#FEE2E2',
          text: '#B91C1C',
        },
        warning: {
          badge: '#FFF8DF',
          text: '#8A6100',
        },
        neutral: {
          badge: '#F3F4F6',
          text: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      transitionTimingFunction: {
        fluid: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};

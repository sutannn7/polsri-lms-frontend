/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand)',
          soft: 'var(--brand-soft)',
        },
        accent: 'var(--accent)',
        background: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        main: 'var(--text)',
        secondary: 'var(--text-muted)',
        border: 'var(--border)',
        success: {
          DEFAULT: 'var(--success)',
          badge: '#DCFCE7',
          text: '#166534',
        },
        danger: {
          DEFAULT: 'var(--danger)',
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
        display: ['Bricolage Grotesque', 'Plus Jakarta Sans', 'sans-serif'],
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

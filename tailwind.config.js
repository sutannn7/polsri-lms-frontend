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
          badge: 'var(--success-soft)',
          text: 'var(--success-text)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          badge: 'var(--danger-soft)',
          text: 'var(--danger-text)',
        },
        warning: {
          badge: 'var(--warning-soft)',
          text: 'var(--warning-text)',
        },
        neutral: {
          badge: 'var(--neutral-soft)',
          text: 'var(--neutral-text)',
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

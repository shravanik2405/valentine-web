/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bgStart: 'rgb(var(--color-bg-start) / <alpha-value>)',
        bgMiddle: 'rgb(var(--color-bg-middle) / <alpha-value>)',
        bgEnd: 'rgb(var(--color-bg-end) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        primaryStrong: 'rgb(var(--color-primary-strong) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        focus: 'rgb(var(--color-focus) / <alpha-value>)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        button: 'var(--radius-button)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
        glow: 'var(--shadow-glow)',
      },
      spacing: {
        gutter: 'var(--space-gutter)',
        section: 'var(--space-section)',
        card: 'var(--space-card)',
      },
      fontFamily: {
        heading: ['Fredoka', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '44rem',
      },
    },
  },
  plugins: [],
};

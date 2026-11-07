/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        surface: 'var(--surface)',
        paper: 'var(--paper)',
        inverse: 'var(--inverse)',
        'inverse-text': 'var(--inverse-text)',
        accent: 'var(--accent)',
        'accent-text': 'var(--accent-text)',
        'on-accent': 'var(--on-accent)',
        'fill-ink': 'var(--fill-ink)',
        'on-ink': 'var(--on-ink)',
        'fill-paper': 'var(--fill-paper)',
        edge: 'var(--edge)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        head: ['"Bricolage Grotesque Variable"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      borderWidth: { DEFAULT: '2px' },
      boxShadow: {
        hard: '4px 4px 0 var(--shadow)',
        'hard-lg': '6px 6px 0 var(--shadow)',
        'hard-sm': '2px 2px 0 var(--shadow)',
      },
      keyframes: {
        tick: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
      },
      animation: { tick: 'tick 1.6s steps(2, end) infinite' },
    },
  },
  plugins: [
    ({ addVariant }) =>
      addVariant('can-hover', '@media (hover: hover) and (pointer: fine)'),
  ],
}

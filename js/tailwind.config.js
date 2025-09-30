/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--header-primary-color)',
        'brand-secondary': 'var(--header-secondary-color)',
        'flarum-bg-primary': 'var(--body-bg)',
        'flarum-bg-secondary': 'var(--control-bg)',
        'flarum-bg-tertiary': 'var(--control-bg-hover)',
        'flarum-text-primary': 'var(--text-color)',
        'flarum-text-secondary': 'var(--muted-color)',
        'flarum-text-tertiary': 'var(--muted-more-color)',
        'flarum-border': 'var(--control-border-color)',
        'flarum-shadow-medium': 'var(--shadow-medium)',
      }
    },
  },
  plugins: [],
}

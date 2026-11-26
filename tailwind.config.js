/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'editor-bg': '#1a1a2e',
        'editor-panel': '#16213e',
        'editor-accent': '#0f3460',
        'editor-highlight': '#e94560',
        'editor-text': '#eaeaea',
        'node-input': '#4a9eff',
        'node-output': '#ff6b6b',
        'node-math': '#feca57',
        'node-texture': '#48dbfb',
        'node-light': '#ff9ff3',
      },
    },
  },
  plugins: [],
}

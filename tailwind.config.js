/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0B1120', // Deep Navy Background
        card: '#111827',     // Lighter Navy for Cards
        accent: '#3B82F6',   // Electric Blue
        teal: '#06B6D4',     // Cyan
        critical: '#EF4444', // Coral Red
        high: '#F59E0B',     // Amber
        medium: '#FACC15',   // Yellow
        low: '#10B981',      // Emerald
      }
    },
  },
  plugins: [],
}
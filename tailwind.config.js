/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        foreground: '#1a1a2e',
        primary: {
          DEFAULT: '#16213e',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#0f3460',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#e94560',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#6b7280',
          foreground: '#9ca3af',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1a1a2e',
        },
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
      },
    },
  },
  plugins: [],
}

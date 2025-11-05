/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Trust Blue - Primary Brand Color (Trust, Security, Stability)
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          DEFAULT: '#2563eb',
        },
        // Growth Green - Positive Actions (Growth, Prosperity, Money)
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
          DEFAULT: '#16a34a',
        },
        // Neutral Grays - Professional Base
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Legacy support
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#16a34a',
        },
        brand: {
          DEFAULT: '#2563eb',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        'gradient-growth': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        'gradient-trust': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-premium': 'linear-gradient(135deg, #171717 0%, #0a0a0a 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(37, 99, 235, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(22, 163, 74, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(37, 99, 235, 0.05) 0px, transparent 50%)',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium-lg': '0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 8px 12px -4px rgba(0, 0, 0, 0.08)',
        'premium-xl': '0 25px 80px -15px rgba(0, 0, 0, 0.2), 0 10px 16px -4px rgba(0, 0, 0, 0.1)',
        'accent': '0 10px 40px -10px rgba(20, 184, 166, 0.3)',
        'accent-lg': '0 20px 60px -15px rgba(20, 184, 166, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}


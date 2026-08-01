import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf6f5',
          100: '#faebd9',
          200: '#f7d5d2',
          300: '#f4bbb6',
          400: '#F1A19B',
          500: '#F1A19B',
          600: '#ce6862',
          700: '#ad4e49',
          800: '#8f423e',
          900: '#783c39',
          950: '#401c1a',
        },
        gold: {
          50:  '#fdf9f0',
          100: '#f8edd8',
          200: '#f1d8b0',
          300: '#e6bd7d',
          400: '#d89f4b',
          500: '#B57A20',
          600: '#9f641a',
          700: '#804b19',
          800: '#6a3c1b',
          900: '#5a331a',
        },
        accent: {
          50:  '#fdf9f0',
          100: '#f8edd8',
          200: '#f1d8b0',
          300: '#e6bd7d',
          400: '#d89f4b',
          500: '#B57A20',
          600: '#9f641a',
          700: '#804b19',
          800: '#6a3c1b',
          900: '#5a331a',
        },
        neutral: {
          50:  '#FAEAD9',
          100: '#f5dec9',
          150: '#ebd0b5',
          200: '#dfbe9f',
          300: '#c89f7a',
          400: '#a87b54',
          500: '#855b38',
          600: '#6a462b',
          700: '#4b311f',
          800: '#2c1c13',
          900: '#131213',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-in':    'slideIn 0.3s ease-out',
        'spin-slow':   'spin 3s linear infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-in':   'bounceIn 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: '0' },           '100%': { opacity: '1' } },
        slideUp:  { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideIn:  { '0%': { transform: 'translateX(-10px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        bounceIn: { '0%,20%,40%,60%,80%,to': { animationTimingFunction: 'cubic-bezier(0.215,0.61,0.355,1)' }, '0%': { transform: 'scale3d(.3,.3,.3)' }, '20%': { transform: 'scale3d(1.1,1.1,1.1)' }, '40%': { transform: 'scale3d(.9,.9,.9)' }, '60%': { transform: 'scale3d(1.03,1.03,1.03)' }, '80%': { transform: 'scale3d(.97,.97,.97)' }, 'to': { transform: 'scale3d(1,1,1)' } },
      },
      boxShadow: {
        'glow':    '0 0 20px rgba(232,80,114,0.3)',
        'glow-lg': '0 0 40px rgba(232,80,114,0.4)',
        'glow-gold': '0 0 25px rgba(212,175,55,0.35)',
        'card':    '0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.02)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03)',
      },
    },
  },
  plugins: [],
};

export default config;

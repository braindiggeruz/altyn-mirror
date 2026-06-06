import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070708',
          900: '#0c0c10',
          800: '#141419',
          700: '#1d1d24',
        },
        gold: {
          50: '#fbf3da',
          100: '#f3e3b0',
          200: '#e9cf80',
          300: '#dcb654',
          400: '#cea03a',
          500: '#b78327',
          600: '#8d6219',
          DEFAULT: '#cea03a',
        },
        ivory: {
          DEFAULT: '#f4ecd8',
          dim: '#c9c1ad',
          mute: '#8b8674',
        },
        bordo: {
          400: '#7a2231',
          500: '#5e1822',
          600: '#43101a',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 8px 40px -10px rgba(206,160,58,0.35)',
        bordo: '0 12px 60px -16px rgba(94,24,34,0.55)',
        ringGold: '0 0 0 1px rgba(206,160,58,0.3), 0 0 60px -10px rgba(206,160,58,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 700ms cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 600ms ease-out both',
        'orbit-slow': 'orbit 28s linear infinite',
        'orbit-rev': 'orbitRev 36s linear infinite',
        'pulse-gold': 'pulseGold 3.2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbitRev: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        pulseGold: {
          '0%,100%': { opacity: '0.55', filter: 'blur(18px)' },
          '50%': { opacity: '0.9', filter: 'blur(28px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zooey: {
          bg: '#030304',
          surface: '#0a0a0f',
          border: 'rgba(255,255,255,0.10)',
          'border-hover': 'rgba(255,255,255,0.32)',
          accent: '#ffffff',
          'accent-dim': 'rgba(255,255,255,0.15)',
          'accent-bright': '#ffffff',
          text: '#f0f0f0',
          'text-muted': 'rgba(255,255,255,0.35)',
          'text-label': 'rgba(255,255,255,0.18)',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0px)' },
        },
        'border-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(74,144,217,0.2), inset 0 0 10px rgba(74,144,217,0.04)' },
          '50%': { boxShadow: '0 0 22px rgba(74,144,217,0.38), inset 0 0 14px rgba(74,144,217,0.08)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2.5s ease-in-out infinite',
        'fade-up': 'fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'border-glow': 'border-glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

import type { Config } from 'tailwindcss';

// Brand tokens mirror brand/tokens.json from the repo root (Phase 2a).
// #FF2D55 is RESERVED for xlOS only — intentionally not declared here.
const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        primary: {
          DEFAULT: '#00F0FF',
          glow: 'rgba(0, 240, 255, 0.35)',
        },
        secondary: {
          DEFAULT: '#00FF9D',
          glow: 'rgba(0, 255, 157, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

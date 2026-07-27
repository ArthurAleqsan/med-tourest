import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f7',
          100: '#d5deeb',
          600: '#1f3a5f',
          700: '#17304f',
          800: '#0f2440',
          900: '#0a1a30',
        },
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bfe1fe',
          300: '#93cdfd',
          400: '#60b0fa',
          500: '#3b91f5',
          600: '#2472ea',
          700: '#1c5bd7',
          800: '#1d4bae',
          900: '#1d4189',
        },
        turquoise: {
          50: '#effcfb',
          100: '#d0f5f3',
          200: '#a6eae8',
          300: '#6dd9d8',
          400: '#38c1c2',
          500: '#1ea4a7',
          600: '#178387',
          700: '#17696d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 36, 64, 0.06), 0 8px 24px rgba(15, 36, 64, 0.06)',
        'card-hover': '0 4px 12px rgba(15, 36, 64, 0.10), 0 16px 40px rgba(15, 36, 64, 0.10)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;

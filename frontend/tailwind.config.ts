import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // GitHub "dark" (Primer) palette
        canvas: {
          default: '#0d1117',
          subtle: '#161b22',
          inset: '#010409',
        },
        border: {
          default: '#30363d',
          muted: '#21262d',
        },
        fg: {
          default: '#e6edf3',
          muted: '#7d8590',
          subtle: '#6e7681',
        },
        accent: {
          fg: '#2f81f7',
          emphasis: '#1f6feb',
        },
        success: {
          fg: '#3fb950',
          emphasis: '#238636',
          hover: '#2ea043',
        },
        btn: {
          bg: '#21262d',
          hover: '#30363d',
          border: '#f0f6fc1a',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;

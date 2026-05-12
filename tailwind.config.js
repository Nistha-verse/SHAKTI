/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shaktiCream: '#FFF9F0',
        shaktiCyan: '#7DD3FC',
        shaktiRose: '#F43F5E',
        shaktiGreen: '#86EFAC',
        shaktiText: '#3B2F2F',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(59, 47, 47, 0.12)',
      },
      keyframes: {
        logoArrive: {
          '0%': { opacity: '0', transform: 'scale(0.86)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        logoFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'logo-arrive': 'logoArrive 700ms ease-out both',
        'logo-float': 'logoFloat 5s ease-in-out 700ms infinite',
      },
    },
  },
  plugins: [],
};

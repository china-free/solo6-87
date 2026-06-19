/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        correct: '#538d4e',
        present: '#b59f3b',
        absent: '#3a3a3c',
      },
      animation: {
        'flip': 'flip 500ms ease forwards',
        'fadeIn': 'fadeIn 200ms ease forwards',
        'bounceIn': 'bounceIn 100ms ease forwards',
        'shake': 'shake 500ms ease forwards',
        'celebrate': 'celebrate 1s ease forwards',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        celebrate: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(-5deg)' },
          '50%': { transform: 'scale(1.2) rotate(5deg)' },
          '75%': { transform: 'scale(1.1) rotate(-5deg)' },
        },
      },
    },
  },
  plugins: [],
};

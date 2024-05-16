import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/core/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    container: {
      center: true,
       padding: {
        DEFAULT: '0rem',
      },
    },
    extend: {
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      spacing: {
        xxs: '6px',
        xs: '10px',
        sm: '20px',
        md: '40px',
        lg: '60px',
        xl: '80px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)"
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)"
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)"
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)"
          },
        },
        typewriter: {
          to: {
            left: '100%',
          },
        },
        blink: {
          '0%': {
            opacity: '0',
          },
          '0.1%': {
            opacity: '1',
          },
          '50%': {
            opacity: '1',
          },
          '50.1%': {
            opacity: '0',
          },
          '100%': {
            opacity: '0',
          },
        },
      },
      animation: {
        blob: "blob 7s infinite",
        typewriter: 'typewriter 0.9s steps(15) forwards',
        typewriterAB: 'typewriter 0.7s steps(10) forwards',
        typewriterABX: 'typewriter 0.7s steps(11) forwards',
        typewriterMUSHRA: 'typewriter 0.8s steps(14) forwards',
        caret: 'typewriter 0.9s steps(15) forwards, blink 1s steps(15) infinite 0.9s',
        caretAB: 'typewriter 0.7s steps(10) forwards, blink 1s steps(10) infinite 0.7s',
        caretABX: 'typewriter 0.7s steps(11) forwards, blink 1s steps(11) infinite 0.7s',
        caretMUSHRA: 'typewriter 0.8s steps(14) forwards, blink 1s steps(14) infinite 0.8s',
      },
      height: {
        200: '48rem'
      },
      width: {
        300: '72rem',
        400: '96rem'
      }
    },
  },
  variants: {
    extend: {
      opacity: ['dark'],
      scale: ['group-hover'],
      rotate: ['group-hover'],
    },
  },
  darkMode: 'class',
  plugins: [],
}
export default config

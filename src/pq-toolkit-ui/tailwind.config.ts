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
      },
      animation: {
        blob: "blob 7s infinite",
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
  plugins: []
}
export default config

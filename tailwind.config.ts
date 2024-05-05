import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {},
  daisyui: {
    themes: ['cupcake']
  },
  plugins: [require('daisyui')]
}

export default config

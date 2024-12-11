/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#253237ff",
        "secondary": "#253237ff",
        "accent": "#b57edc",
        "neutral": "#253237ff",
        "base-100": "#253237ff",
        "info": "#84b6f4",
        "success": "#77dd77",
        "warning": "#fdcc9b",
        "error": "#ff6961",
      },
    },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
}

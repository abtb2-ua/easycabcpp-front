/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [{
            myPastel: {
                "primary": "#253237ff",
                "secondary": "#b0c2f2",
                "accent": "#b57edc",
                "neutral": "gainsboro",
                "base-100": "#253237ff",
                "info": "#84b6f4",
                "success": "#77dd77",
                "warning": "#ffb46aff",
                "error": "#ff6961",
            },
        },
        ],
    },
    safelist: [
        'alert-success',
        'alert-warning',
        'alert-error',
        "btn-success",
        "btn-warning",
        "btn-error",
    ],
    plugins: [
        require('daisyui'),
    ],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html', './js/**/*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'charcoal':       '#121212',
                'charcoal-light': '#1E1E1E',
                'bronze':         '#A67C52',
                'bronze-dark':    '#8B6543',
                'pristine':       '#FFFFFF',
                'soft-gray':      '#F5F5F5',
                'border-gray':    '#E5E5E5',
            },
            fontFamily: {
                'headline': ['Plus Jakarta Sans', 'sans-serif'],
                'body':     ['Inter', 'sans-serif'],
                'label':    ['Manrope', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0px',
                lg:      '0px',
                xl:      '0px',
                full:    '9999px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};

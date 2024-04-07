import daisy from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        daisy
    ],
    daisyui: {
        themes: [
            'dark',
            {
                custom: {
                    'base-100': '#b0d3ff',
                    'base-content': '#333',
                    'primary': '#af9bff',
                    'secondary': '#fff18a',


                    'accent': '#006600',
                    'neutral': '#140205',
                    'info': '#007fef',
                    'success': '#8ede51',
                    'warning': '#bd8000',
                    'error': '#c2152d'
                }
            }
        ]
    }
};

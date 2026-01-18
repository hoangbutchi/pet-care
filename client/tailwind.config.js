/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: '#8D8741', // Olive Green
                secondary: '#659DBD', // Muted Blue
                accent: '#BC986A', // Medium Brown
                tan: '#DAAD86', // Light Brown
                cream: '#FBEEC1', // Pale Yellow/Cream
                'mint-light': '#FBEEC1', // Mapping old var to new cream for safety
                'mint-medium': '#DAAD86', // Mapping old var to tan
            },
        },
    },
    plugins: [],
}

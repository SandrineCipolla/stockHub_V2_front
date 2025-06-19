/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

    darkMode: 'class', // Permet de basculer entre les thèmes dark et light
    theme: {
        extend: {
            colors: {
                // Vous pouvez personnaliser les couleurs ici
                purple: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
    // safelist: [
    //     // Ajouter des classes que vous utilisez dynamiquement pour qu'elles ne soient pas purgées
    //     'bg-emerald-400',
    //     'bg-amber-400',
    //     'bg-red-400',
    //     'text-emerald-400',
    //     'text-amber-400',
    //     'text-red-400',
    //     'text-emerald-600',
    //     'text-amber-600',
    //     'text-red-600',
    //     'text-emerald-300',
    //     'text-amber-300',
    //     'text-red-300',
    //     'hover:bg-red-500/20',
    //     'hover:bg-red-100',
    //     'bg-emerald-500/20',
    //     'bg-amber-500/20',
    //     'bg-red-500/20',
    //     'bg-emerald-100',
    //     'bg-amber-100',
    //     'bg-red-100',
    //     'bg-blue-500/20',
    //     'bg-blue-100',
    //     'text-blue-400',
    //     'text-blue-600',
    //     {
    //         pattern: /bg-(white|slate|purple|gray|emerald|amber|red|blue)-(50|100|200|300|400|500|600|700|800|900)/,
    //     },
    //     {
    //         pattern: /text-(white|slate|purple|gray|emerald|amber|red|blue)-(50|100|200|300|400|500|600|700|800|900)/,
    //     },
    //     {
    //         pattern: /hover:bg-(white|slate|purple|gray|emerald|amber|red|blue)-(50|100|200|300|400|500|600|700|800|900)/,
    //     },
    //     {
    //         pattern: /hover:text-(white|slate|purple|gray|emerald|amber|red|blue)-(50|100|200|300|400|500|600|700|800|900)/,
    //     },
    //     {
    //         pattern: /border-(white|slate|purple|gray|emerald|amber|red|blue)-(50|100|200|300|400|500|600|700|800|900)/,
    //     },
    // ],
}
// module.exports = {
//     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// }

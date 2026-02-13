import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "tech-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
            colors: {
                background: "#0f172a", // Deep Slate 900
                foreground: "#f8fafc", // Slate 50
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9', // Base Primary
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b', // Base Secondary
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                // Futuristic Accents
                cyber: {
                    500: '#00f0ff', // Cyan Neon
                    600: '#00d0ff',
                    900: '#0090ff',
                },
                neon: {
                    green: '#00ff9d',
                    purple: '#b026ff',
                },
                success: {
                    50: '#ecfdf5',
                    500: '#10b981',
                    700: '#047857',
                },
                warning: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    700: '#b45309',
                },
                danger: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    700: '#b91c1c',
                },
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(14, 165, 233, 0.3)',
                'glow-md': '0 0 20px rgba(14, 165, 233, 0.5)',
                'glow-lg': '0 0 30px rgba(14, 165, 233, 0.6)',
                'neon-blue': '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;

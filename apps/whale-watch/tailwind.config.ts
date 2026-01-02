import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./features/burner/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)"],
                mono: ["var(--font-jetbrains-mono)"],
            },
            colors: {
                neutral: {
                    925: "#0a0a0a",
                },
            },
        },
    },
    plugins: [],
};

export default config;

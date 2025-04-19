import type { Config } from "tailwindcss";
import twAnimate from "tw-animate-css";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [twAnimate],
};

export default config;

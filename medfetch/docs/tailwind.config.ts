import type { Config } from "tailwindcss";
import twAnimate from "tw-animate-css";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./node_modules/shadcn-ui/**/*.{ts,tsx}", // or however you're including ShadCN
    ],
    theme: {
        extend: {},
    },
    plugins: [twAnimate],
};

export default config;

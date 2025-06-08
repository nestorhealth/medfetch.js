import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
    // @ts-ignore
    test: {
        // coverage: {
        //     exclude: [
        //         "src/examples/**",
        //         "**/*.test.ts"
        //     ],
        //     include: [
        //         "src/**"
        //     ]
        // },
        browser: {
            enabled: true,
            provider: "preview",
            instances: [{ browser: "chromium" }],
        },
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    build: {
        lib: {
            entry: "src/block-promise.ts",
            formats: ["es"],
            fileName: "block-promise"
        },
    },
});

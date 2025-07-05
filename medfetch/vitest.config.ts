import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "istanbul",
            include: [
                "src/**/*.ts"
            ],
        },
        browser: {
            enabled: true,
            provider: "preview",
            instances: [
                {
                    browser: "chromium",
                },
            ],
        },
        include: ["src/**/*.test.ts"],
        globals: true,
    },
    // for SharedArrayBuffer access
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
});

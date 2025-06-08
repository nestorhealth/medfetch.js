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
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
    },
    optimizeDeps: {
        exclude: ["@sqlite.org/sqlite-wasm"],
    },
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            external: ["@sqlite.org/sqlite-wasm", "kysely"],
            output: {
                manualChunks: undefined,
                entryFileNames: `[name].js`,
                chunkFileNames: `[name]-[hash].js`,
                assetFileNames: `[name]-[hash].[ext]`,
            },
        },
        lib: {
            entry: {
                "sql": "src/sql.ts",
                "sqlite-wasm": "src/sqlite-wasm.ts",
                "sqlite-wasm.worker": "src/sqlite-wasm.worker.ts",
                "fetch.worker": "src/fetch.worker.ts"
            },
            formats: ["es"],
            fileName: (format, name) =>
                format === "esm" || format === "es"
                    ? `${name}.mjs`
                    : `${name}.js`,
        },
    },
});

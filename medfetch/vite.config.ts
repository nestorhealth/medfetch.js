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
            "~": path.resolve(__dirname, "src")
        },
    },
    optimizeDeps: {
        exclude: ["@sqlite.org/sqlite-wasm"]
    },
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            external: ["@sqlite.org/sqlite-wasm", "kysely", "node:worker_threads", "@tanstack/react-query"],
            output: {
                manualChunks: undefined,
                entryFileNames: `[name].js`,
                chunkFileNames: `[name]-[hash].js`,
                assetFileNames: `[name]-[hash].[ext]`,
            },
        },
        lib: {
            entry: {
                "block": "src/block.ts",
                "block.node": "src/block.node.ts",
                "dialects": "src/dialects.ts",
                "react": "src/react.ts",
                "sqlite-wasm": "src/sqlite-wasm.ts",
                "sqlite-wasm.worker": "src/sqlite-wasm.worker.ts",
                "threads/sqlite-wasm.db": "src/threads/sqlite-wasm.db.ts",
                "threads/sqlite-wasm.fetch": "src/threads/sqlite-wasm.fetch.ts",
            },
            formats: ["es"],
            fileName: (format, name) =>
                format === "esm" || format === "es"
                    ? `${name}.mjs`
                    : `${name}.js`,
        },
    },
});

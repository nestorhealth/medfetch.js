import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
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
            external: [
                "kysely",
                "@sqlite.org/sqlite-wasm",
                "@tanstack/react-query",
                "react",
                "react-dom",
                "node:worker_threads",
            ],
            output: {
                manualChunks: undefined,
                entryFileNames: `[name].js`,
                chunkFileNames: `[name]-[hash].js`,
                assetFileNames: `[name]-[hash].[ext]`,
            },
        },
        lib: {
            entry: {
                "unpromisify": "src/unpromisify.ts",
                "unpromisify.node": "src/unpromisify.node.ts",
                "sql": "src/sql.ts",
                // Rename entry so rollup can properly split react
                "next": "src/next.ts",
                "sqlite-wasm": "src/sqlite-wasm.ts",
                "sqlite-wasm.loadExtension": "src/sqlite-wasm.loadExtension.ts",
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

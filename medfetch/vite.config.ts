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
                entryFileNames: `[name].mjs`,
                chunkFileNames: `[name]-[hash].mjs`,
                assetFileNames: `[name]-[hash].[ext]`,
            },
        },
        lib: {
            entry: {
                index: "src/index.ts",
                "fetch.worker": "src/fetch.worker.ts",
                "sqlite-wasm/index": "src/sqlite-wasm/index.ts",
                "sqlite-wasm/worker": "src/sqlite-wasm/worker.ts"
                /*                 index: "src/index.ts",
                view: "src/view.ts",
                sof: "src/sof.ts",
                fetch: "src/fetch.ts",
                "sqlite-wasm/index": "src/sqlite-wasm/index.ts",
                "sqlite-wasm/main": "src/sqlite-wasm/main.ts",
                "sqlite-wasm/medfetch": "src/sqlite-wasm/medfetch.ts",
                "sqlite-wasm/types": "src/sqlite-wasm/types.ts",
                "sqlite-wasm/worker1": "src/sqlite-wasm/worker1.ts", */
            },
            name: "medfetch",
            formats: ["es"],
            fileName: (format, name) =>
                format === "esm" || format === "es"
                    ? `${name}.mjs`
                    : `${name}.js`,
        },
    },
});

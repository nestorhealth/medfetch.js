import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
    // @ts-ignore
    test: {
        coverage: {
            exclude: [
                "src/examples/**",
                "**/*.test.ts"
            ],
            include: [
                "src/**"
            ]
        }
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
    optimizeDeps: {
        exclude: ["@sqlite.org/sqlite-wasm", "effect", "fhirpath"]
    },
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            external: ["effect", "fhirpath", "@sqlite.org/sqlite-wasm"],
            output: {
                entryFileNames: `[name].mjs`,
                chunkFileNames: `[name]-[hash].mjs`,
                assetFileNames: `[name]-[hash].[ext]`,
            },
        },
        lib: {
            entry: {
                index: "src/index.ts",
                view: "src/view.ts",
                sof: "src/sof.ts",
                "fetch-worker": "src/fetch-worker.ts",
                "sqlite-wasm/index": "src/sqlite-wasm/index.ts",
                "sqlite-wasm/main": "src/sqlite-wasm/main.ts",
                "sqlite-wasm/medfetch": "src/sqlite-wasm/medfetch.ts",
                "sqlite-wasm/types": "src/sqlite-wasm/types.ts",
                "sqlite-wasm/worker1": "src/sqlite-wasm/worker1.ts"
            },
            name: "medfetch",
            formats: ["es"],
            fileName: (format, name) => format === "esm" || format === "es" ? `${name}.mjs` : `${name}.js`,
        },
    }
});


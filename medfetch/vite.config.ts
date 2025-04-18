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
            '~': path.resolve(__dirname, 'src'),
        },
    },
    optimizeDeps: {
        exclude: ["@sqlite.org/sqlite-wasm", "effect", "fhirpath", "better-worker1"]
    },
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            external: ["effect", "fhirpath", "@sqlite.org/sqlite-wasm", "better-worker1"],
            output: {
                entryFileNames: `[name].mjs`,
                chunkFileNames: `[name]-[hash].mjs`,
                assetFileNames: `[name]-[hash].[ext]`,
            },
            plugins: [
                {
                    name: "rename-js-to-mjs",
                    generateBundle(_, bundle) {
                        for (const [fileName, chunkInfo] of Object.entries(bundle)) {
                            if (
                                chunkInfo.type === "chunk" &&
                                fileName.endsWith(".js")
                            ) {
                                const newFileName = fileName.replace(/\.js$/, ".mjs");
                                bundle[newFileName] = {
                                    ...chunkInfo,
                                    fileName: newFileName,
                                };
                                delete bundle[fileName];
                            }
                        }
                    },
                },
            ],
        },
        lib: {
            entry: {
                index: "src/index.ts",
                view: "src/view.ts",
                sof: "src/sof.ts",
                "sqlite-wasm": "src/sqlite-wasm.ts",
                "fetch-worker": "src/fetch-worker.ts"
            },
            name: "medfetch",
            formats: ["es"],
            fileName: (format, name) => `${name}.mjs`,
        },
    }
});


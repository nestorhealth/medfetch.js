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
        exclude: ["@sqlite.org/sqlite-wasm", "fhirpath"],
    },
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            external: [
                "@sqlite.org/sqlite-wasm",
                "effect",
                "fhirpath"
            ],
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
                "sqlite/index": "src/sqlite/index.ts",
                "sqlite/medfetch.vtab": "src/sqlite/medfetch.vtab.ts",
                "sqlite/fetch.worker": "src/sqlite/fetch.worker.ts"
            },
            name: "medfetch",
            formats: ["es"],
            fileName: (format, name) => `${name}.mjs`,
        },
    }
});


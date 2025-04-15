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
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
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
                "browser/index": "src/browser/index.ts",
                "browser/medfetch.vtab": "src/browser/medfetch.vtab.ts",
                "browser/fetch.worker": "src/browser/fetch.worker.ts"
            },
            name: "medfetch",
            formats: ["es"],
            fileName: (format, name) => `${name}.mjs`,
        },
    }
});


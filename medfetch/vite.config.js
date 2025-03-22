import { defineConfig } from 'vite';
import path from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            "@sqlite-worker": path.resolve(import.meta.dirname, "node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-worker1.js"),
        }
    },
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },
    optimizeDeps: {
        exclude: ['@sqlite.org/sqlite-wasm'],
    },
});

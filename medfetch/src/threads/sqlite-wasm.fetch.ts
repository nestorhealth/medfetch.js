/// <reference lib="webworker" />
import block from "../block.js";

// For the default sqlite3 worker thread, no validate
export const [syncFetch, setSyncFetch] = block(
    ["sqlite-wasm.db", "sqlite-wasm.fetch"],
    (...args: Parameters<typeof fetch>) => fetch(...args)
        .then(response => response.text()),
    {
        byteSize: 5 * 1024 * 1024 // 5 MB
    }
);

setSyncFetch();
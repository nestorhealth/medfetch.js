/// <reference lib="webworker" />
import block from "../block-promise/block.js";

// For the default sqlite3 worker thread, no validate
export const [syncFetch, ping] = block(
    ["sqlite-wasm", "sqlite-wasm.block"],
    (...args: Parameters<typeof fetch>) => fetch(...args)
        .then(response => response.json())
        .then(JSON.stringify)
);

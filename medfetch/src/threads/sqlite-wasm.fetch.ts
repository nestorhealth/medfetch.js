/// <reference lib="webworker" />
import unpromisify from "../unpromisify.js";

// For the default sqlite3 worker thread, no validate
export const [syncFetch, setSyncFetch] = unpromisify(
    "sqlite-wasm.db",
    (...args: Parameters<typeof fetch>) => fetch(...args)
        .then(response => response.text()),
    {
        byteSize: 5 * 1024 * 1024 // 5 MB
    }
);

setSyncFetch();
/// <reference lib="webworker" />
import block from "./block-promise/block.js";

export const [syncFetch, ping] = block(
    ["sqlite-wasm.thread", "sqlite-wasm.block"],
    async (...args: Parameters<typeof fetch>) => {
        const response = await fetch(...args);
        const payload = await response.json();
        return JSON.stringify(payload);
    },
);

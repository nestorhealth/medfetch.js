import block from "block-promise";

/**
 * @internal
 * The tag for the default sqlite-wasm to fetch-sync worker block
 */
export const SQLITE_WASM_BLOCK = "sqlite-wasm.block";

/**
 * @internal
 */
export const [syncFetch, pingSqliteWasmBlock] = block(
    ["medfetch/sqlite-wasm.worker", "medfetch/sqlite-wasm.block"],
    async (...args: Parameters<typeof fetch>) => {
        const response = await fetch(...args);
        const payload = await response.json();
        return JSON.stringify(payload);
    },
);
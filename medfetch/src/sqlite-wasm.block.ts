import block from "block-promise";

console.log("UHHH", self.name)

export const [syncFetch, pingSqliteWasmBlock, pong] = block(
    ["sqlite-wasm.worker", "sqlite-wasm.block"],
    async (...args: Parameters<typeof fetch>) => {
        const response = await fetch(...args);
        const payload = await response.json();
        return JSON.stringify(payload);
    },
);

pong();
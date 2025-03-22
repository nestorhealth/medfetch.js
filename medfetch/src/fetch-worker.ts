import { nresources } from "./data";

self.onmessage = async (e: MessageEvent) => {
    const sqlitePort = e.ports[0];
    sqlitePort.onmessage = async (e: MessageEvent) => {
        const { signalBuffer, resourceType } = e.data;
        const signal = new Int32Array(signalBuffer, 0, 1);
        const dataBytes = new Uint8Array(signalBuffer, 4);

        const resources = await nresources("https://r4.smarthealthit.org", resourceType, -1, 250);
        const jsonStr = JSON.stringify(resources);
        const encoded = new TextEncoder().encode(jsonStr);

        if (encoded.length + 1 > dataBytes.length) {
            throw new Error(`Response too large for SharedArrayBuffer. In bytes, the stringified resources are ${encoded.length + 1} bytes but the sqlite worker thread only allocated ${dataBytes.length} for it...`);
        }

        dataBytes.set(encoded);
        dataBytes[encoded.length] = 0; // null terminator

        Atomics.store(signal, 0, 1);
        Atomics.notify(signal, 0);
    };

};


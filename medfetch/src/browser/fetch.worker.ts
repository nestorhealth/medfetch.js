export interface FetchMessageInit {
    type: "init";
}

export interface FetchMessageRequest {
    type: "request";
    sharedSignal: SharedArrayBuffer;
    url: string;
    init?: RequestInit;
}

onmessage = (e: MessageEvent<FetchMessageInit>) => {
    e.ports[0].onmessage = async (e: MessageEvent<FetchMessageRequest>) => {
        const { sharedSignal, url, init } = e.data;
        const signal = new Int32Array(sharedSignal, 0, 1); // 32bits = 4 bytes for the signal
        const sizeView = new DataView(sharedSignal, 4, 4); // declare as DataView so we can write size as little-endian
        const dataBytes = new Uint8Array(sharedSignal, 8); // byte array

        const response = await fetch(url, init);
        const payload = await response.json();
        const jsonStr = JSON.stringify(payload);
        const encoded = new TextEncoder().encode(jsonStr);

        if (encoded.length > dataBytes.length) {
            throw new Error(
                `Response too large for SharedArrayBuffer. In bytes, the stringified resources are ${encoded.length + 1} bytes but the sqlite worker thread only allocated ${dataBytes.length} for it...`,
            );
        }
        sizeView.setUint32(0, encoded.length, true);
        dataBytes.set(encoded);

        // release lock
        Atomics.store(signal, 0, 1);
        Atomics.notify(signal, 0);
    };
    e.ports[0].postMessage("ready");
};

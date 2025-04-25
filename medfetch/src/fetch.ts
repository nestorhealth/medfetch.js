import { Effect } from "effect";
import { Fetch } from "./fetch.services.js";

/**
 * The main call routine, which sets the "condvar"
 * signal to 1 to wake up the sleeping thread.
 * Or something like that...
 * @param e
 * @returns void 0, writes the payload back to dataBytes from the sharedSignal
 */
const onMessage = (e: MessageEvent<Fetch>) => {
    return Fetch.$match(e.data, {
        request: async ({ sab, url, init }) => {
            const signal = new Int32Array(sab, 0, 1);
            const sizeView = new DataView(sab, 4, 4);
            const dataBytes = new Uint8Array(sab, 8);

            const response = await fetch(url, init);
            const payload = await response.json();
            const jsonStr = JSON.stringify(payload);
            const encoded = new TextEncoder().encode(jsonStr);

            if (encoded.length > dataBytes.length) {
                throw new Error(
                    `Response too large for SharedArrayBuffer. Needed ${encoded.length + 1}, got ${dataBytes.length}`,
                );
            }

            sizeView.setUint32(0, encoded.length, true);
            dataBytes.set(encoded);

            Atomics.store(signal, 0, 1);
            Atomics.notify(signal, 0);
        }
    });
};

self.onmessage = (e) =>
    Effect.fromNullable(e.ports[0])
        .pipe(
            Effect.tap((port) => {
                port.onmessage = onMessage;
                port.postMessage("fetch-ready");
            }),
        )
        .pipe(Effect.runSync);

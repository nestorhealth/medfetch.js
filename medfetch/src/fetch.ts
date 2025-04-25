import { Effect } from "effect";
import { Fetch } from "./fetch.services.js";

const __RESPONSE_MAP__ = new Map<number, Response>();

/**
 * The main call routine, which sets the "condvar"
 * signal to 1 to wake up the sleeping thread.
 * Or something like that...
 * @param e
 * @returns void 0, writes the payload back to dataBytes from the sharedSignal
 */
const onMessage = (e: MessageEvent<Fetch>) => {
    return Fetch.$match(e.data, {
        request: async ({ sab, url, init, id }) => {
            const signal = new Int32Array(sab, 0, 1);
            const response = await fetch(url, init);
            __RESPONSE_MAP__.set(id, response);
            Atomics.store(signal, 0, 1);
            Atomics.notify(signal, 0);
        },
        readJson: async ({ sab, id }) => {
            const signal = new Int32Array(sab, 0, 1);
            const payloadMaxSize = sab.byteLength - 8;
            const sizeView = new DataView(sab, 4, 4);
            const dataBytes = new Uint8Array(sab, 8, payloadMaxSize);

            const cached = __RESPONSE_MAP__.get(id);
            if (!cached) {
                Atomics.store(signal, 0, -1);
                Atomics.notify(signal, 0);
                return;
            }
            __RESPONSE_MAP__.delete(id);

            const payload = await cached.json();
            const backToText = JSON.stringify(payload);

            const encoded = new TextEncoder().encode(backToText);

            if (encoded.length > payloadMaxSize) {
                console.error(`Response too large for SharedArrayBuffer. Needed ${encoded.length}, got ${payloadMaxSize}`);
                Atomics.store(signal, 0, -1);
                Atomics.notify(signal, 0);
                return;
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

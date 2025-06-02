import { FetchMessage } from "./fetch.services.js";
import { fromNullable, runSync, tap } from "effect/Effect";

const __RESPONSE_MAP__ = new Map<number, Response>();
const __READER_MAP__ = new Map<number, ReadableStreamDefaultReader>();

/**
 * The main call routine, which sets the "condvar" signal to 1 to wake up the sleeping thread.
 * @param e The incoming MessageEvent
 * @returns Promise<void 0>; writes the payload back to dataBytes from the sharedSignal
 */
const onMessage = (e: MessageEvent<FetchMessage>): Promise<void> => {
    return FetchMessage.$match(e.data, {
        /**
         * onRequest
         * @param param0 
         */
        async request(message) {
            const signal = new Int32Array(message.sab, 0, 1);
            const status = new Int32Array(message.sab, 4, 1);

            const response = await fetch(message.url, message.init);
            __RESPONSE_MAP__.set(message.id, response);
            status[0] = response.status;

            Atomics.store(signal, 0, 1);
            Atomics.notify(signal, 0);
        },
        async readJson(message) {
            const signal = new Int32Array(message.sab, 0, 1);
            const payloadMaxSize = message.sab.byteLength - 8;
            const sizeView = new DataView(message.sab, 4, 4);
            const dataBytes = new Uint8Array(message.sab, 8, payloadMaxSize);

            const response = __RESPONSE_MAP__.get(message.id);
            if (!response) {
                Atomics.store(signal, 0, -1);
                Atomics.notify(signal, 0);
                return;
            }
            __RESPONSE_MAP__.delete(message.id);

            const payload = await response.json();
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
        },
        async startStream({ sab, id }) {
            const signal = new Int32Array(sab, 0, 1);
            const response = __RESPONSE_MAP__.get(id);
            if (!response || !response.body) {
                Atomics.store(signal, 0, -1);
                Atomics.notify(signal, 0);
                return;
            }
            __RESPONSE_MAP__.delete(id);

            const reader = response.body.getReader();
            __READER_MAP__.set(id, reader);

            Atomics.store(signal, 0, 1);
            Atomics.notify(signal, 0);
        },
        async readChunk({ sab, id }) {
            const signal = new Int32Array(sab, 0, 1);
            const sizeView = new DataView(sab, 4, 4);
            const payloadMaxSize = sab.byteLength - 8;
            const dataBytes = new Uint8Array(sab, 8, payloadMaxSize);

            const reader = __READER_MAP__.get(id);
            if (!reader) {
                Atomics.store(signal, 0, -1);
                Atomics.notify(signal, 0);
                return;
            }

            const { done, value } = await reader.read();

            if (done || !value) {
                sizeView.setUint32(0, 0, true);
                Atomics.store(signal, 0, 1);
                Atomics.notify(signal, 0);
                __READER_MAP__.delete(id);
                return;
            }

            if (value.length > payloadMaxSize) {
                console.error(`Chunk too big for SAB`);
                Atomics.store(signal, 0, -1);
                Atomics.notify(signal, 0);
                return;
            }

            sizeView.setUint32(0, value.length, true);
            dataBytes.set(value);
            Atomics.store(signal, 0, 1);
            Atomics.notify(signal, 0);
        }

    });
};

self.onmessage = (e) =>
    fromNullable(e.ports[0])
    .pipe(
        tap((port) => {
            port.onmessage = onMessage;
            port.postMessage("fetch-ready");
        }),
    )
    .pipe(runSync);

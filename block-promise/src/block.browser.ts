import { viewSab } from "./block.common";
import type { Block, MessageConfig } from "./block.types";

export const isBrowserWorkerThread =
    typeof window === "undefined" &&
    typeof self !== "undefined" &&
    typeof importScripts === "function";

export default function block<Args extends any[], Result>(
    name: string,
    asyncFn: (...args: Args) => Promise<Result>,
    {
        encode = JSON.stringify,
        decode = JSON.parse,
        byteSize = 500_000,
    }: Partial<MessageConfig<Result>> = {},
): Block<Args, Result> {
    const sync = (...args: Args): Result => {
        if (isBrowserWorkerThread && self.name === name) {
            const sab = new SharedArrayBuffer(8 + byteSize);
            const [signal, buffer] = viewSab(sab);
            signal[0] = 0;
            self.postMessage({ sab, args });
            Atomics.wait(signal, 0, 0);
            const rc = Atomics.load(signal, 0);
            if (rc) throw new Error("Deferred error");
            const len = signal[1];
            const text = new TextDecoder().decode(buffer.slice(0, len));
            return decode(text);
        } else {
            if (isBrowserWorkerThread) {
                console.warn(
                    `[block-promise] > A different worker (name=${self.name}) is calling the sync handle, doing nothing...`,
                );
                return void 0 as Result;
            } else {
                console.warn(
                    `[block-promise] > Call to sync handle in non-worker context, returning void 0...`,
                );
                return void 0 as Result;
            }
        }
    };
    
    const handle = (worker: Worker | ((name: string) => Worker)) => {
        let blockedWorker: Worker;
        if (typeof worker === "function") {
            blockedWorker = worker(name);
        } else {
            blockedWorker = worker;
        }
        blockedWorker.onmessage = async (e: MessageEvent<any>) => {
            if (e.data && e.data.sab) {
                const { sab, args } = e.data;
                const [signal, buffer] = viewSab(sab);
                let rc = 0;
                try {
                    const result = await asyncFn(...args);
                    const encoded = new TextEncoder().encode(encode(result));
                    if (encoded.length > buffer.length)
                        throw new Error("Too large");
                    buffer.set(encoded);
                    signal[1] = encoded.length;
                } catch {
                    rc = 1;
                } finally {
                    Atomics.store(signal, 0, rc);
                    Atomics.notify(signal, 0);
                }
            }
        };
        return blockedWorker;
    }

    return [
        sync,
        handle,
    ];
}

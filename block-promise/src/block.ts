import type { Block, MessageConfig, WorkerHandle } from "./block.types";

const isBrowserWorkerThread =
    typeof window === "undefined" &&
    typeof self !== "undefined" &&
    typeof importScripts === "function";

/**
 * Returns a plain 2-tuple {@link Array} "view" of a given SharedArrayBuffer
 * where bytes 0-7 are the signal bytes and bytes 8 - N are allocated for the
 * message data.
 *
 * @param sab A {@link SharedArrayBuffer}
 * @returns [ signalBytes as Int32Array, resultBuffer as Uint8Array ]
 */
export function viewSab(sab: SharedArrayBuffer): [Int32Array, Uint8Array] {
    return [new Int32Array(sab, 0, 2), new Uint8Array(sab, 8)];
}


export default function block<Args extends any[], Result>(
    name: string,
    asyncFn: (...args: Args) => Promise<Result>,
    {
        encode = JSON.stringify,
        decode = JSON.parse,
        byteSize = 500_000,
    }: Partial<MessageConfig<Result>> = {},
): Block<Args, Result> {
    let resolvedPort: MessagePort | WorkerGlobalScope | undefined = undefined;

    const sync = (...args: Args): Result => {
        if (isBrowserWorkerThread && self.name === name) {
            const sab = new SharedArrayBuffer(8 + byteSize);
            const [signal, buffer] = viewSab(sab);
            if (resolvedPort instanceof MessagePort) {
                // Parent/owner case
                resolvedPort.postMessage({ sab, args });
            } else {
                self.postMessage({ sab, args });
            }
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

    const handleAsyncTask = async (e: MessageEvent) => {
        if (e.data && e.data.sab) {
            const { sab, args } = e.data;
            const [signal, buffer] = viewSab(sab);
            let rc = 0;
            try {
                const result = await asyncFn(...args);
                const encoded = new TextEncoder().encode(
                    encode(result),
                );
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
    }
    
    const handle: WorkerHandle = async (workerFn) => {
        const worker = typeof workerFn === "function" ? workerFn(name) : workerFn;
        if (self.name === name) {
            // If the deferrer "owns" the task worker
            const asyncWorker = worker;
            const { port1, port2 } = new MessageChannel();
            resolvedPort = await new Promise<MessagePort>((resolve, reject) => {
                const handleHandshakeResponse = (e: MessageEvent) => {
                    if (e.data === 0) {
                        port1.removeEventListener("message", handleHandshakeResponse);
                        resolve(port1);
                    } else {
                        port1.removeEventListener("message", handleHandshakeResponse);
                        reject(
                            new Error(
                                `Unexpected message: ${JSON.stringify(e.data)}`,
                            ),
                        );
                    }
                };
                port1.addEventListener("message", handleHandshakeResponse);
                port1.start();
                asyncWorker.postMessage(
                    null,
                    [port2],
                );
            });
        } else { // Otherwise the caller of handle is the owner
            worker.onmessage = handleAsyncTask;
        }
        return worker;
    };
    
    /**
     * Only useful if the deferring worker is the owner of the
     * task handler thread.
     * @param e The message event
     */
    const onMessage = (e: MessageEvent) => {
        if (e.ports && e.ports[0]) {
           const port = e.ports[0];
            port.postMessage(0);
            port.onmessage = handleAsyncTask; 
        }
    }

    return [sync, handle, onMessage];
}

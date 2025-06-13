import type { Block, MessageConfig, Ping } from "./block.types";

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

/**
 * Block a worker when it calls the returned sync handle (element 0 in {@link Block}) on the provided {@link blockingFn}
 * @param name The name of the *deferrer*, meaning the worker that needs to block.
 * @param blockingFn The async function to block on
 * @param config The optional configuration, see {@link MessageConfig}
 * @returns A {@link Block} 3 tuple.
 *
 * 1. Example of deferring async task to main thread
 * @example
 * ```ts
 * // worker.ts
 * export const [getTodos, handleGetTodos] = block(
 *   "getTodos",
 *   async (n: number) => {
 *     const response = await fetch("https://dummyjson.com/todos");
 *     const payload = await response.json();
 *     return payload.todos[n];
 * });
 * if (self.name === "getTodos") {
 *   const todos = getTodos(0);
 *   console.log("Worker got todos", todos);
 * }
 *
 * // main.ts
 * import { handleGetTodos } from "./worker.js";
 * // Depends on how bundler resolves workers
 * const worker = new Worker(new URL("./worker.js", import.meta.url), {
 *   type: "module",
 *   name: "getTodos"
 * });
 * handleGetTodos(worker);
 * ```
 */
export default function block<Args extends any[], Result>(
    name: string | [string, string],
    blockingFn: (...args: Args) => Promise<Result>,
    {
        encode = JSON.stringify,
        decode = JSON.parse,
        byteSize = 500_000,
    }: Partial<MessageConfig<Result>> = {},
): Block<Args, Result> {
    const isNameArray = Array.isArray(name);
    const syncWorkerName = isNameArray ? name[0] : name;
    const asyncWorkerName = isNameArray ? name[1] : null;
    let workerPort: Worker | MessagePort | undefined = undefined;

    const blockFn = (...args: Args): Result => {
        if (self.name === syncWorkerName) {
            const sab = new SharedArrayBuffer(8 + byteSize);
            const [signal, buffer] = viewSab(sab);
            if (!self) {
                console.warn(
                    `[block-promise::${name}] > I can't post that message. Did you forget to set the async worker?`,
                );
                return void 0 as Result;
            }
            if (workerPort) {
                workerPort.postMessage({ sab, args });
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
            if (self.name === asyncWorkerName) {
                console.warn(
                    `[block-promise::${syncWorkerName}] > From async worker: ${asyncWorkerName}: "I can't block for that worker: ${self.name}"`,
                );
                return void 0 as Result;
            } else {
                return void 0 as Result;
            }
        }
    };

    const resolveBlockingPromise = async (e: MessageEvent) => {
        if (e.data && e.data.sab) {
            const { sab, args } = e.data;
            const [signal, buffer] = viewSab(sab);
            let rc = 0;
            try {
                const result = await blockingFn(...args);
                const encoded = new TextEncoder().encode(encode(result));
                if (encoded.length > buffer.length)
                    throw new Error(`[block-promise::${name}] > Too large`);
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

    const ping: Ping = async (workerFn) => {
        const worker =
            typeof workerFn === "function"
                ? workerFn({
                      syncWorker: syncWorkerName,
                      asyncWorker: asyncWorkerName,
                  })
                : workerFn;
        if (self.name === syncWorkerName) {
            // Case 1. The worker is providing the async handler
            workerPort = await handshakePing(worker);
        } else {
            worker.onmessage = resolveBlockingPromise;
        }
        return worker;
    };
    
    const pong = () => {
        /**
        * Only useful if the deferring worker is the owner of the
        * task handler thread.
        * @param e The message event
        */
        if (self.name === asyncWorkerName) {
            console.log("[block-promise] > Registering \"forward \" async worker thread", asyncWorkerName);
            self.onmessage = (e: MessageEvent) => {
                if (e.ports && e.ports[0]) {
                    const port = e.ports[0];
                    port.postMessage(0);
                    port.onmessage = resolveBlockingPromise;
                }
            };
        }
    }
    if (self.name === asyncWorkerName) {
        pong();
    }

    return [blockFn, ping];
}

async function handshakePing(worker: Worker) {
    const { port1, port2 } = new MessageChannel();
    return new Promise<MessagePort>((resolve, reject) => {
        const handleHandshakeResponse = (e: MessageEvent) => {
            if (e.data === 0) {
                port1.removeEventListener("message", handleHandshakeResponse);
                resolve(port1);
            } else {
                port1.removeEventListener("message", handleHandshakeResponse);
                reject(
                    new Error(`Unexpected message: ${JSON.stringify(e.data)}`),
                );
            }
        };
        port1.addEventListener("message", handleHandshakeResponse);
        port1.start();
        worker.postMessage(null, [port2]);
    });
}

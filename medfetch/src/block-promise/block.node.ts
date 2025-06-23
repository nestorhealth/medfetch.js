import { view } from "./block.js";
import type { Block, MessageConfig, SetWorker } from "./block.types.js";
import {
    Worker,
    MessageChannel,
    MessagePort,
    parentPort,
    workerData,
} from "node:worker_threads";

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
 *   ["getTodos"],
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
    name: [string] | [string, string],
    blockingFn: (...args: Args) => Promise<Result>,
    {
        encode = JSON.stringify,
        decode = JSON.parse,
        byteSize = 500_000,
    }: Partial<MessageConfig<Result>> = {},
): Block<Args, Result, Worker> {
    const syncWorkerName = name[0];
    const asyncWorkerName = name[1] ?? null;
    let workerPort: Worker | MessagePort | undefined = undefined;

    const blockFn = (...args: Args): Result => {
        if (workerData?.name === syncWorkerName) {
            const sab = new SharedArrayBuffer(8 + byteSize);
            const [signal, buffer] = view(sab);
            if (!parentPort) {
                throw new Error(
                    `[block-promise::${workerData?.name}] Nothing to block on...`,
                );
            }
            if (workerPort) {
                workerPort.postMessage({ sab, args });
            } else {
                parentPort.postMessage({ sab, args });
            }
            Atomics.wait(signal, 0, 0);
            const rc = Atomics.load(signal, 0);
            if (rc) throw new Error("Deferred error");
            const len = signal[1];
            const text = new TextDecoder().decode(buffer.slice(0, len));
            return decode(text);
        } else {
            if (workerData?.name === asyncWorkerName) {
                console.warn(
                    `[block-promise::${syncWorkerName}] > From async worker: ${asyncWorkerName}: "I can't block for that worker: ${self.name}"`,
                );
                return void 0 as Result;
            } else {
                return void 0 as Result;
            }
        }
    };

    const resolveBlockingPromise = async (e: {
        sab: SharedArrayBuffer;
        args: Args;
    }) => {
        if (e && e.sab) {
            const { sab, args } = e;
            const [signal, buffer] = view(sab);
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

    const ping: SetWorker<Worker> = async (workerFn) => {
        const worker =
            typeof workerFn === "function"
                ? workerFn({
                      syncWorker: syncWorkerName,
                      asyncWorker: asyncWorkerName,
                  })
                : workerFn;
        if (workerData?.name === syncWorkerName) {
            // Case 1. The worker is providing the async handler
            workerPort = await handshakePing(worker);
        } else {
            parentPort?.on("message", resolveBlockingPromise);
        }
        return worker;
    };

    const pong = () => {
        /**
         * Only useful if the deferring worker is the owner of the
         * task handler thread.
         * @param e The message event
         */
        if (workerData?.name === asyncWorkerName) {
            console.log(
                '[block-promise] > Registering "forward " async worker thread',
                asyncWorkerName,
            );
            parentPort?.on("message", (e) => {
                if (e.ports && e.ports[0]) {
                    const port = e.ports[0];
                    port.postMessage(0);
                    port.on("message", resolveBlockingPromise);
                }
            });
        }
    };
    if (workerData?.name === asyncWorkerName) {
        pong();
    }

    return [blockFn, ping];
}

async function handshakePing(worker: Worker) {
    const { port1, port2 } = new MessageChannel();
    return new Promise<MessagePort>((resolve, reject) => {
        const handleHandshakeResponse = (e: MessageEvent) => {
            if (e.data === 0) {
                port1.off("message", handleHandshakeResponse);
                resolve(port1);
            } else {
                port1.off("message", handleHandshakeResponse);
                reject(
                    new Error(`Unexpected message: ${JSON.stringify(e.data)}`),
                );
            }
        };
        port1.on("message", handleHandshakeResponse);
        port1.start();
        worker.postMessage(null, [port2]);
    });
}

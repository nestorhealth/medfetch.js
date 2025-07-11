/**
 * Wait on a specific response from the provided {@link Emitter}
 * @param check When the promise should resolve
 * @param addEventListener Callback to add the promise wrapping handler
 * @param removeEventListener Callback to remove the handler
 * @returns The {@link MessageEvent} in a Promise
 *
 * @example
 */
export async function forMessage<Message = MessageEvent<any>>(
    post: () => void,
    check: (event: Message) => boolean,
    addEventListener: (handler: (event: Message) => any) => void,
    removeEventListener: (handler: (event: Message) => any) => void,
): Promise<Message> {
    return new Promise((resolve, _reject) => {
        post();
        const handler = (event: Message) => {
            if (check(event)) {
                resolve(event);
                removeEventListener(handler);
            }
        };
        addEventListener(handler);
    });
}

type WorkerLike = {
    postMessage: (...args: any[]) => any;
    addEventListener: (msgEvent: any, cb: (...args: any[]) => any) => any;
    removeEventListener: (msgEvent: any, cb: (...args: any[]) => any) => any;
    start?: () => void;
};

export type SetWorker = (
    worker: Worker | (typeof globalThis & Window),
) => Promise<MessagePort>;

/**
 * The 2-tuple returned by {@link unpromisify}
 *
 * @template Args the arguments the original function takes
 * @template Result the awaited return type of the original function
 * @template TWorker The worker type. Defaults to Browser {@link Worker}
 */
// #region Unpromisified
export type Unpromisified<Args extends any[], Result> = readonly [
    /**
     * Literally just takes asyncFn's {@link ReturnType} out of the
     * {@link Promise}
     */
    syncFn: (...args: Args) => Result,

    /**
     * Setup message event listeners to allow for blocking on
     * {@link syncFn}.
     */
    setWorker: SetWorker,
];
// #endregion Unpromisified

export type CreateSyncPromise = <Args extends any[], Result>(
    names: [string] | [string, string],
    fn: (...args: Args) => Promise<Result>,
) => Unpromisified<Args, Result>;

/**
 * Set the encoder and decoder pairs along with
 * allocated byte size of the buffer in the message handlers.
 *
 * @template Result The awaited return type of the deferred async function
 */
// #region PayloadConfig
export interface PayloadConfig<Result> {
    /**
     * How to serialize the return type into a plaintext string? Defaults to
     * {@link JSON.stringify}
     * @param result The awaited return type
     * @returns Its string serialization.
     */
    encode: (result: Result) => Uint8Array;

    /**
     * How to deserialize the text value back into an object? Defaults to
     * {@link JSON.parse}
     * @param text The plaintext of the value
     * @returns The result parsed
     */
    decode: (text: Uint8Array) => Result;

    /**
     * How many bytes to allocate for the underlying {@link SharedArrayBuffer}
     * for the payload. 8 bytes at the start are always allocated for the
     * signal value, so total byte size will be this 8 + {@link byteSize}:
     *
     * ```ts
     * const sab = new SharedArrayBuffer(8 + byteSize)
     * ```
     *
     * Defaults to 500,000
     */
    byteSize: number;
}
// #endregion PayloadConfig

/**
 * Returns a plain 2-tuple {@link Array} "view" of a given SharedArrayBuffer
 * where bytes 0-7 are the signal bytes and bytes 8 - N are allocated for the
 * message data.
 *
 * @param sab A {@link SharedArrayBuffer}
 * @returns [ signalBytes as Int32Array, resultBuffer as Uint8Array ]
 */
function view(sab: SharedArrayBuffer): [Int32Array, Uint8Array] {
    return [new Int32Array(sab, 0, 2), new Uint8Array(sab, 8)];
}

/**
 * Down on a semaphore
 * @param bufferSize Size of shared array buffer
 * @param waitOn The post message to wait on
 * @returns
 */
function down(
    bufferSize: number,
    waitOn: (sab: SharedArrayBuffer) => void,
): [dataBytes: number, data: Uint8Array] {
    const sab = new SharedArrayBuffer(bufferSize);
    const [signal, buffer] = view(sab);
    waitOn(sab);
    Atomics.wait(signal, 0, 0);
    const len = signal[1];
    return [len, buffer];
}

/**
 * "Increment" a semaphore (doesn't really increment) and wake
 * up the corresponding waiting thread.
 * @param sab The SharedArrayBuffer sent from the thread calling {@link down}
 * @param data The data bytes to write in
 * @returns void
 */
function up(sab: SharedArrayBuffer, data: Uint8Array): void {
    const [signal, buffer] = view(sab);
    let rc = 0;
    try {
        if (data.length > buffer.length) {
            throw new Error(
                `[medfetch/block] > Data bytes larger than SharedArrayBuffer size.`,
            );
        }
        buffer.set(data);
        signal[1] = data.length;
    } catch {
        rc = 1;
    } finally {
        Atomics.store(signal, 0, rc);
        Atomics.notify(signal, 0);
    }
}

export type EvEmitterCallback<EvEmitter = Worker, Value = any> = (
    port: EvEmitter,
    value: Value,
) => void;

export type BlockMessageData<Args extends any[], TPort = MessagePort> = {
    readonly ports: ReadonlyArray<TPort>;
    readonly sab: SharedArrayBuffer;
    readonly args: Args;
};

/**
 * Create the Accept Handler for the sync->async case,
 * and get back both the primary resolve function that handles
 * awaiting the promise AND the accept() function for the initial handshake
 * (if needed)
 *
 * @param deferredFn The deferred async function returning its encoded form
 * @param postMessage From the given port and value, give the implementation for posting this message back to the parent thread
 * @param setOnMessage From the given port and onMessage handler, provide the implementation for setting the message handler of this port to onMessage
 */
// function createAsyncHandlers<Args extends any[], Port = MessagePort>(
//     deferredFn: (...args: Args) => Promise<Uint8Array>,
//     postMessage: EvEmitterCallback<Port>,
//     setOnMessage: EvEmitterCallback<Port>,
// ) {
//     async function resolveBlock(e: MessageEventLike<Args, Port>) {
//         if (e.data.sab) {
//             let args = e.data.args;
//             const sab = e.data.sab;
//             if (
//                 typeof sab !== "object" ||
//                 !(sab instanceof SharedArrayBuffer)
//             ) {
//                 throw new Error(
//                     `Can't resolve that block > Unexpected "sab" payload type.`,
//                 );
//             }
//             args = args || [];
//             const result = await deferredFn(...args);
//             up(sab, result);
//         }
//     }

//     function acceptBlock(e: MessageEventLike<Args, Port>) {
//         const port = e.data.ports[0];
//         if (port) {
//             postMessage(port, 0);
//             setOnMessage(port, resolveBlock);
//         }
//     }

//     return {
//         accept: acceptBlock,
//         resolve: resolveBlock,
//     };
// }

/**
 * Create the accept handler for both parties of the block to allow
 * the synchronous proxy function to run.
 * @param context The web worker context
 * @param start Port start function
 * @param postMessage The postMessage callback
 * @param addWorkerHandler The add worker handler callback
 * @param addMessageHandler How to add a message handler
 * @param removeMessageHandler How to remove a message handler
 * @param onHandshakeComplete What side effect to run after handshake is complete
 * @returns A {@link SetWorkerLike} accept function
 */
export function syncSetter<
    Args extends any[],
    Result,
    TWorker extends WorkerLike,
>(
    context: {
        thread: ThreadContext<TWorker>;
        encoder: EncoderContext<Args, Result>;
    },
    onHandshakeComplete: (port: MessagePort) => void,
): SetWorker {
    const { encoder } = context;
    async function resolveBlock(e: MessageEvent<any>) {
        if (e.data.sab) {
            let args = e.data.args;
            const sab = e.data.sab;
            if (
                typeof sab !== "object" ||
                !(sab instanceof SharedArrayBuffer)
            ) {
                throw new Error(
                    `Can't resolve that block > Unexpected "sab" payload type.`,
                );
            }
            args = args || [];
            const result = await encoder
                .blockingFn(...args)
                .then(encoder.encode);
            up(sab, result);
        }
    }

    async function set(workerLike: Worker | (typeof globalThis & Window)) {
        if (self.name !== context.thread.syncWorkerName && workerLike) {
            const { port1, port2 } = new MessageChannel();
            port1.start();
            await forMessage(
                () => workerLike.postMessage(null, [port2]),
                (e) => e.data === "pong",
                (h) => port1.addEventListener("message", h),
                (h) => port1.removeEventListener("message", h),
            );
            port1.addEventListener("message", resolveBlock);
            port1.postMessage("ping");
            return port1;
        } else {
            if (workerLike instanceof Worker) {
                throw new Error(`Async child handler case removed for now!`);
            } else {
                return new Promise<MessagePort>((resolve) => {
                    const handle = async (e: MessageEvent<any>) => {
                        if (e.ports.length > 0) {
                            const parentPort = e.ports[0];
                            parentPort.start();
                            await forMessage(
                                () => parentPort.postMessage("pong"),
                                (e) => e.data === "ping",
                                (h) =>
                                    parentPort.addEventListener("message", h),
                                (h) =>
                                    parentPort.removeEventListener(
                                        "message",
                                        h,
                                    ),
                            );
                            onHandshakeComplete(parentPort);
                            workerLike.removeEventListener("message", handle);
                            resolve(parentPort);
                        }
                    };
                    workerLike.addEventListener("message", handle);
                });
            }
        }
    }
    return set;
}

type Nullish<T> = NonNullable<T> | undefined | null;

export type ThreadContext<TMessagePort = MessagePort> = {
    /**
     * Assigned static name for the sync-worker that will be blocking.
     */
    syncWorkerName: string;

    /**
     * Null on main. Some string otherwise
     */
    currentWorkerThread: Nullish<string>;

    createMessageChannel: () => { port1: TMessagePort; port2: TMessagePort };
};

type DecoderContext<Result> = {
    byteSize: number;
    decode: (buffer: Uint8Array) => Result;
};

type EncoderContext<Args extends any[], Result> = {
    blockingFn: (...args: Args) => Promise<Result>;
    encode: (result: Result) => Uint8Array;
};

export function syncProxy<
    Args extends any[],
    Result,
    TMessagePort = MessagePort,
>(
    context: {
        thread: ThreadContext<TMessagePort>;
        decoder: DecoderContext<Result>;
    },
    semaphoreDown: (data: { args: Args; sab: SharedArrayBuffer }) => void,
): (...args: Args) => Result {
    const { thread, decoder } = context;
    function syncHandler(...args: Args): Result {
        if (thread.currentWorkerThread === thread.syncWorkerName) {
            const upResult = down(8 + decoder.byteSize, (sab) => {
                semaphoreDown({ sab, args });
            });
            if (upResult[0] <= 0) {
                throw new Error(
                    `[sync.syncHandler] > "semaphore_down()" returned 0 bytes written back`,
                );
            } else {
                const [len, buffer] = upResult;
                const decoded = decoder.decode(buffer.slice(0, len));
                return decoded;
            }
        } else {
            console.error(
                `[sync.syncHandler] > Can't block on that thread "${thread.currentWorkerThread}". Can only block on ${thread.syncWorkerName}.`,
            );
            return void 0 as any;
        }
    }
    return syncHandler;
}

// async function handshake<TWorker = Worker, TMessagePort = MessagePort>(
//     worker: TWorker,
//     messageChannelLike: {
//         port1: TMessagePort;
//         port2: TMessagePort;
//     },
//     addHandler: EvEmitterCallback<TMessagePort, (e: any) => void>,
//     removeHandler: EvEmitterCallback<TMessagePort, (e: any) => void>,
//     postMessage: EvEmitterCallback<
//         TWorker,
//         {
//             readonly ports: ReadonlyArray<TMessagePort>;
//         }
//     >,
// ): Promise<TMessagePort> {
//     const { port1, port2 } = messageChannelLike;
//     await forMessage(
//         () => postMessage(worker, { ports: [port2] }),
//         (e) => e.data === 0,
//         (f) => addHandler(port1, f),
//         (f) => removeHandler(port1, f),
//     );
//     return port1;
// }

/**
 * Block a worker when it calls the returned sync handle (element 0 in {@link Unpromisified}) on the provided {@link asyncFn}
 * @param syncWorkerName The name of the *deferrer*, meaning the worker that needs to block.
 * @param asyncFn The async function to block on
 * @param config The optional configuration, see {@link PayloadConfig}
 * @returns A {@link Unpromisified} 2 tuple.
 *
 * Pay attention to how the 2nd element returned (index 1) in the 2-tuple needs to be called.
 * @example
 * 1. Parent of Sync Worker is Async Handler
 * Inside sync-worker file
 * ```ts
 * // worker.ts -- Block Fn declaration
 * import unpromisify from "medfetch/unpromisify";
 *
 * export const [getTodos, handleGetTodos] = unpromisify(
 *   "getTodos",
 *   async (n: number) => {
 *     const response = await fetch("https://dummyjson.com/todos");
 *     const payload = await response.json();
 *     return payload.todos[n];
 * });
 *
 * handleGetTodos(); // Pass in exactly 0 arguments or a falsy value so the "sync" branches hit and you don't need to await this
 * ```
 *
 * Then inside main file
 * ```ts
 * // main.ts -- Set async handler
 * import { handleGetTodos } from "./worker.js";
 * // Depends on how bundler resolves workers
 * const worker = new Worker(new URL("./worker.js", import.meta.url), {
 *   type: "module",
 *   name: "getTodos" // This needs to match!
 * });
 * // If you need to pass in a worker, THEN this becomes a promise
 * handleGetTodos(worker).then(
 *   () => {
 *     console.log("You can resume main thread code after awaiting the \"handleGetTodos()\" function!")
 *   }
 * );
 * ```
 *
 * @example
 * 2. Child of Sync Worker is Async Handler
 * ```ts
 * // worker-sync.ts -- Block Fn declaration
 * export const [getTodos, handleGetTodos] = unpromisify(
 *   "getTodos",
 *   async (n: number) => {
 *     const response = await fetch("https://dummyjson.com/todos");
 *     const payload = await response.json();
 *     return payload.todos[n];
 * });
 *
 * if (self.name === "getTodos") {
 *   const workerAsync = new Worker(new URL("./worker-async.js", import.meta.url), {
 *     type: "module",
 *     name: "getTodosHandler" // This doesn't matter, but it's always helpful to give descriptive names to workers
 *   })
 *   handleGetTodos(workerAsync).then(
 *     () => {
 *       console.log("For the sync-worker thread to defer promise to child...")
 *       console.log("It ironicially needs to await an async handshake...")
 *       console.log("The first todo is", getTodos(0));
 *       console.log("...")
 *       console.log("Stick to pattern 1 if possible. It's a lot simpler!")
 *     }
 *   )
 * }
 * ```
 * Then inside the child-worker
 * ```ts
 * /// worker-async.ts -- Accept
 * import {handleGetTodos} from "./worker-sync.js";
 * if (self.name === "getTodosHandler") {
 *   handleGetTodos(); // Just need to call it once!
 * }
 * ```
 *
 * You (still) need to set the sync-worker name to match the key you passed into element 0 in the first argument of the block function
 * ```ts
 * /// main.ts -- Your main thread file
 * const worker = new Worker("./worker-sync.js", {
 *   name: "getTodos"
 * });
 * console.log("Main thread isn't participating in the Block here, so it just needs to spawn the worker. No need to call the setter function!");
 * ```
 */
export default function unpromisify<
    Args extends any[],
    Result,
    TWorkerLike extends WorkerLike,
>(
    syncWorkerName: string,
    asyncFn: (...args: Args) => Promise<Result>,
    {
        encode = (result) => {
            const plaintext = JSON.stringify(result);
            const encoder = new TextEncoder();
            return encoder.encode(plaintext);
        },
        decode = (result) => {
            const decoded = new TextDecoder().decode(result);
            const parsed = JSON.parse(decoded);
            return parsed;
        },
        byteSize = 500_000,
    }: Partial<PayloadConfig<Result>> = {},
): Unpromisified<Args, Result> {
    let workerPort: MessagePort | undefined = undefined;

    const currentThread =
        typeof WorkerGlobalScope === "undefined" ? null : self.name;
    const threadContext: ThreadContext = {
        currentWorkerThread: currentThread,
        syncWorkerName: syncWorkerName,
        createMessageChannel: () => new MessageChannel(),
    };
    const decoderContext: DecoderContext<Result> = {
        decode: decode,
        byteSize: byteSize,
    };

    const syncFn = syncProxy(
        {
            thread: threadContext,
            decoder: decoderContext,
        },
        (data) => {
            if (workerPort) {
                workerPort.postMessage(data);
            } else {
                self.postMessage(data);
            }
        },
    );

    const handleSyncPromise = syncSetter<Args, Result, TWorkerLike>(
        {
            thread: threadContext as any,
            encoder: {
                blockingFn: asyncFn,
                encode: encode,
            },
        },
        (port) => {
            workerPort = port;
        },
    );
    return [syncFn, handleSyncPromise];
}

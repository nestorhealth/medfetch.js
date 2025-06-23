export type SetWorker<TWorker = Worker> = {
    (worker: TWorker): Promise<void>;
    (): void;
};

/**
 * The 2-tuple returned by [block()](./block.browser.ts)
 *
 * @template Args the arguments the original function takes
 * @template Result the awaited return type of the original function
 */
export type Block<Args extends any[], Result, TWorker = Worker> = readonly [
    (...args: Args) => Result,
    SetWorker<TWorker>,
];

export type CreateBlock<TWorker = Worker> =
    <Args extends any[], Result>(
        names: [string] | [string, string],
        fn: (...args: Args) => Promise<Result>
    ) => Block<Args, Result, TWorker>;

/**
 * Set the encoder and decoder pairs along with
 * allocated byte size of the buffer in the message handlers.
 *
 * @template Result The awaited return type of the deferred async function
 */
export interface MessageConfig<Result> {
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
 * "Increment" a semaphore (doesn't really need to increment) and wake
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
function createAsyncHandlers<Args extends any[], Port = MessagePort>(
    deferredFn: (...args: Args) => Promise<Uint8Array>,
    postMessage: EvEmitterCallback<Port>,
    setOnMessage: EvEmitterCallback<Port>,
) {
    async function resolveBlock(e: MessageEventLike<Args, Port>) {
        let { sab, args } = e.data;
        if (!sab) {
            throw new Error(
                `Can't resolve that block > No SharedArrayBuffer found!`,
            );
        }
        if (typeof sab !== "object" || !(sab instanceof SharedArrayBuffer)) {
            throw new Error(
                `Can't resolve that block > Unexpected "sab" payload type.`,
            );
        }
        args = args || [];
        const result = await deferredFn(...args);
        up(sab, result);
    }

    function acceptBlock(e: MessageEventLike<Args, Port>) {
        const port = e.data.ports[0];
        if (port) {
            postMessage(port, 0);
            setOnMessage(port, resolveBlock);
        }
    }

    return {
        accept: acceptBlock,
        resolve: resolveBlock,
    };
}

type MessageEventLike<Args extends any[], TPort = MessagePort> = {
    readonly ports: ReadonlyArray<TPort>;
    readonly data: BlockMessageData<Args, TPort>;
};

export function createSetBlock<
    Args extends any[],
    Result,
    TWorker = Worker,
    TPort = MessagePort,
>(
    context: {
        thread: ThreadContext<TPort, TPort>;
        encoder: EncoderContext<Args, Result>
    },
    start: (port: TPort) => void,
    postMessage: EvEmitterCallback<TWorker, {ports: ReadonlyArray<TPort>}>,
    addWorkerHandler: EvEmitterCallback<
        TWorker,
        (e: MessageEventLike<Args>) => void
    >,
    addMessageHandler: EvEmitterCallback<TPort, (e: any) => void>,
    removeMessageHandler: EvEmitterCallback<TPort, (e: any) => void>,
    onHandshakeComplete: (port: TPort) => void,
): SetWorker<TWorker> {
    const { encoder, thread } = context;
    const { accept, resolve } = createAsyncHandlers<Args>(
        (...args) => encoder.blockingFn(...args).then(encoder.encode),
        (port, value) => port.postMessage(value),
        (port, onMessage) => (port.onmessage = onMessage),
    );

    async function setChildAsync(worker: TWorker): Promise<void> {
        const ports = thread.createMessageChannel();
        if (thread.currentThread === thread.syncWorkerName) {
            const port = await handshake(
                worker,
                ports,
                (port, handler) => {
                    start(port);
                    addMessageHandler(port, handler);
                },
                (port, handler) => removeMessageHandler(port, handler),
                (port, data) => postMessage(port, data),
            );
            onHandshakeComplete(port);
        } else {
            // Doesn't need to be a promise but doing so
            // here manually to make a consistent set() API
            addWorkerHandler(worker, resolve);
            return Promise.resolve();
        }
    }

    function set(worker: TWorker): Promise<void>;
    function set(): void;
    function set(worker?: TWorker): void | Promise<void> {
        if (!worker) {
            if (
                thread.currentThread === thread.syncWorkerName ||
                thread.currentThread === thread.asyncWorkerName
            ) {
                addWorkerHandler(thread.parentPort as any, accept);
            } else {
                throw new Error(`Wrong thread called "set()": ${self.name}`);
            }
        } else {
            return setChildAsync(worker);
        }
    }
    return set;
}

type Nullish<T> = NonNullable<T> | undefined | null;

export type ThreadContext<ParentPort = Worker, TMessagePort = MessagePort> = {
    /**
     * Assigned static name for the sync-worker that will be blocking.
     */
    syncWorkerName: string;
    
    /**
     * Assigned static name for the async-worker that will be resolving
     * it's *parent*'s promise if assigned.
     */
    asyncWorkerName: Nullish<string>;

    /**
     * Null on main. Some string otherwise
     */
    currentThread: Nullish<string>;
    
    parentPort: Nullish<ParentPort>;
    
    createMessageChannel: () => {port1: TMessagePort; port2: TMessagePort}
};

type DecoderContext<Result> = {
    byteSize: number;
    decode: (buffer: Uint8Array) => Result;
}

type EncoderContext<Args extends any[], Result> = {
    blockingFn: (...args: Args) => Promise<Result>;
    encode: (result: Result) => Uint8Array;
}


export function createSyncHandler<Args extends any[], Result, ParentPort = MessagePort, TMessagePort = MessagePort>(
    context: {
        thread: ThreadContext<ParentPort, TMessagePort>;
        decoder: DecoderContext<Result>
    },
    semaphoreDown: (data: { args: Args; sab: SharedArrayBuffer }) => void,
) {
    const { thread, decoder } = context;
    function syncHandler(...args: Args): Result {
        if (thread.currentThread === thread.syncWorkerName) {
            const upResult = down(8 + decoder.byteSize, (sab) => {
                semaphoreDown({ sab, args });
            });
            if (upResult[0] <= 0) {
                throw new Error(
                    `[block.syncHandler] > "semaphore_down()" returned 0 bytes written back, returning null...`,
                );
            } else {
                const [len, buffer] = upResult;
                const decoded = decoder.decode(buffer.slice(0, len));
                return decoded;
            }
        } else {
            throw new Error(
                `[block.syncHandler] > Can't block on that thread "${thread.currentThread}". Can only block on ${thread.syncWorkerName}. Returning empty as a result...`,
            );
        }
    }
    return syncHandler;
}

async function handshake<TWorker = Worker, TMessagePort = MessagePort>(
    worker: TWorker,
    messageChannelLike: {
        port1: TMessagePort;
        port2: TMessagePort;
    },
    addHandler: EvEmitterCallback<TMessagePort, (e: any) => void>,
    removeHandler: EvEmitterCallback<TMessagePort, (e: any) => void>,
    postMessage: EvEmitterCallback<
        TWorker,
        {
            readonly ports: ReadonlyArray<TMessagePort>;
        }
    >,
): Promise<TMessagePort> {
    const { port1, port2 } = messageChannelLike;
    return new Promise<TMessagePort>((resolve, reject) => {
        const handleHandshakeResponse = (e: MessageEvent) => {
            if (e.data === 0) {
                removeHandler(port1, handleHandshakeResponse);
                resolve(port1);
            } else {
                removeHandler(port1, handleHandshakeResponse);
                reject(
                    new Error(`Unexpected message: ${JSON.stringify(e.data)}`),
                );
            }
        };
        addHandler(port1, handleHandshakeResponse);
        postMessage(worker, {
            ports: [port2],
        });
    });
}

/**
 * Block a worker when it calls the returned sync handle (element 0 in {@link Block}) on the provided {@link blockingFn}
 * @param name The name of the *deferrer*, meaning the worker that needs to block.
 * @param blockingFn The async function to block on
 * @param config The optional configuration, see {@link MessageConfig}
 * @returns A {@link Block} 2 tuple.
 *
 * Pay attention to how the 2nd element returned (index 1) in the 2-tuple needs to be called.
 * @example
 * 1. Parent of Sync Worker is Async Handler
 * Inside sync-worker file
 * ```ts
 * // worker.ts -- Block Fn declaration
 * export const [getTodos, handleGetTodos] = block(
 *   ["getTodos"],
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
 * export const [getTodos, handleGetTodos] = block(
 *   ["getTodos", "getTodosHandler"],
 *   async (n: number) => {
 *     const response = await fetch("https://dummyjson.com/todos");
 *     const payload = await response.json();
 *     return payload.todos[n];
 * });
 *
 * if (self.name === "getTodos") {
 *   const workerAsync = new Worker(new URL("./worker-async.js", import.meta.url), {
 *   type: "module",
 *   name: "getTodosHandler" // Name matters!
 * })
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
 *   name: "getTodos" // Name **still** matters!!
 * });
 * console.log("Main thread isn't participating in the Block here, so it just needs to spawn the worker. No need to call the setter function!");
 * ```
 */
export default function block<Args extends any[], Result>(
    name: [string] | [string, string],
    blockingFn: (...args: Args) => Promise<Result>,
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
    }: Partial<MessageConfig<Result>> = {},
): Block<Args, Result> {
    let workerPort: Worker | MessagePort | undefined = undefined;

    const syncWorkerName = name[0];
    const asyncWorkerName = name[1] ?? null;
    const currentThread =
        typeof WorkerGlobalScope === "undefined" ? null : self.name;
    const threadContext: ThreadContext = {
        currentThread: currentThread,
        syncWorkerName: syncWorkerName,
        asyncWorkerName: asyncWorkerName,
        parentPort: self as any as Worker,
        createMessageChannel: () => new MessageChannel()
    };
    const decoderContext: DecoderContext<Result> = {
        decode: decode,
        byteSize: byteSize,
    };
    const blockFn = createSyncHandler(
        {
            thread: threadContext,
            decoder: decoderContext
        },
        (data) => {
            if (workerPort) {
                workerPort.postMessage(data);
            } else {
                self.postMessage(data);
            }
        },
    );

    const set = createSetBlock<Args, Result>(
        {
            thread: threadContext as any,
            encoder: {
                blockingFn: blockingFn,
                encode: encode
            }
        },
        (port) => port.start(),
        (ee, v) => ee.postMessage(v, v.ports as any),
        (ee, v) => (ee.onmessage = v),
        (ee, v) => ee.addEventListener("message", v),
        (ee, v) => ee.removeEventListener("message", v),
        (port) => {
            workerPort = port;
        },
    );
    return [blockFn, set];
}

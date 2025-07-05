import {
    type MessageConfig,
    type Unpromisified,
    syncProxy,
    ThreadContext,
    syncSetter,
} from "./unpromisify.js";
import {
    Worker,
    MessageChannel,
    MessagePort,
    parentPort,
    workerData,
    isMainThread,
} from "node:worker_threads";

/**
 * Block a worker when it calls the returned sync handle (element 0 in {@link Unpromisified}) on the provided {@link blockingFn}
 * @param name The name of the *deferrer*, meaning the worker that needs to block.
 * @param blockingFn The async function to block on
 * @param config The optional configuration, see {@link MessageConfig}
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
export default function unpromisify<Args extends any[], Result>(
    syncWorkerName: string,
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
): Unpromisified<Args, Result, Worker> {
    let workerPort: Worker | MessagePort | undefined = undefined;
    const threadContext: ThreadContext<MessagePort, MessagePort> = {
        syncWorkerName,
        currentWorkerThread: isMainThread ? null : workerData?.name,
        parentPort: parentPort,
        createMessageChannel: () => new MessageChannel(),
    }

    const blockFn = syncProxy(
        {
            thread: threadContext,
            decoder: {
                byteSize: byteSize,
                decode: decode,
            }
        },
        (data) => {
            if (workerPort) {
                (workerPort as any).postMessage({ data });
            } else {
                parentPort!.postMessage({ data });
            }
        },
    );
    const set = syncSetter<Args, Result, Worker, MessagePort>(
        {
            thread: threadContext,
            encoder: {
                blockingFn,
                encode
            }
        },
        port => port.start(),
        (port, data) => port.postMessage({ data }, data.ports),
        (port, handler) => port.on("message", handler),
        (port, handler) => port.on("message", handler),
        (port, handler) => port.off("message", handler),
        port => {
            workerPort = port
        }
    )

    return [blockFn, set];
}

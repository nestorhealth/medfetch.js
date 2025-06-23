import {
    type MessageConfig,
    type Block,
    createSyncHandler,
    ThreadContext,
    createSetBlock,
} from "./block.js";
import {
    Worker,
    MessageChannel,
    MessagePort,
    parentPort,
    workerData,
    isMainThread,
} from "node:worker_threads";

/**
 * Block a worker when it calls the returned sync handle (element 0 in {@link Block}) on the provided {@link blockingFn}
 * @param name The name of the *deferrer*, meaning the worker that needs to block.
 * @param blockingFn The async function to block on
 * @param config The optional configuration, see {@link MessageConfig}
 * @returns A {@link Block} 2 tuple.
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
): Block<Args, Result, Worker> {
    let workerPort: Worker | MessagePort | undefined = undefined;

    const syncWorkerName = name[0];
    const asyncWorkerName = name[1] ?? null;
    const threadContext: ThreadContext<MessagePort, MessagePort> = {
        syncWorkerName,
        asyncWorkerName,
        currentThread: isMainThread ? null : workerData?.name,
        parentPort: parentPort,
        createMessageChannel: () => new MessageChannel(),
    }

    const blockFn = createSyncHandler(
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
    const set = createSetBlock<Args, Result, Worker, MessagePort>(
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

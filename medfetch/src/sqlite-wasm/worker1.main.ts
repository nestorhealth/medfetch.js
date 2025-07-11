import { KeyCounter } from "./counters.js";
// Get the Sqlite3CreateWorker1Promiser in scope
import type {
    Sqlite3CreateWorker1Promiser,
    Worker1MessageType,
    Worker1Promiser,
    Worker1Response,
    Worker1ResponseError,
} from "./types.js";
import { Worker1Error } from "./types.js";
import "@sqlite.org/sqlite-wasm";

/**
 * Wrap an sqlite3 web worker with the sqlite3 `worker1promiser`
 * handle SYNCHRONOUSLY (defers the promise of the function to the first call of the promiser). **YOU** (the caller) are in charge of keeping this handle alive in your script!!
 * @param worker The worker to wrap
 * @returns The promiser-sync function
 */
export function promiserSyncV2<TWorker = Worker>(worker: TWorker) {
    const promiserPromise = (
        (globalThis as any)
            .sqlite3Worker1Promiser as any as Sqlite3CreateWorker1Promiser<TWorker>
    ).v2({
        worker,
    });
    const f = unwrap(promiserPromise);
    return f;
}

/**
 * Throw if response.type === "error"
 * @param response The worker1 response
 * @returns The response type narrowed
 */
export function check<T extends Worker1MessageType>(
    response: Worker1Response<T> | Worker1ResponseError<T>,
): Worker1Response<T> {
    if (response.type === "error") {
        throw new Worker1Error("main", "Unexpected response");
    }
    return response as any;
}

interface ArgsData {
    params: Parameters<Worker1Promiser>;
    transfers: StructuredSerializeOptions;
    messageType: Worker1MessageType;
}

function checkArgs([arg0, arg1]: [any, any]): ArgsData {
    if (!arg0) throw new Worker1Error("main", "you passed 0 args lol");
    if (typeof arg0 === "string") {
        arg1 ||= {}; // need to pass in an object in arg1 even for 0 args
        return {
            params: [arg0, arg1],
            messageType: arg0,
        } as any;
    } else if (typeof arg0 === "object") {
        let structured: StructuredSerializeOptions;
        if (Array.isArray(arg1)) structured = { transfer: arg1 };
        else structured = arg1 as StructuredSerializeOptions;
        return {
            params: [arg0],
            transfers: structured,
            messageType: arg0.type,
        } as any;
    }
    throw new Worker1Error("main", `invalid arguments [${arg0}, ${arg1}]`);
}

function unwrap(f: Promise<Worker1Promiser>): Worker1Promiser {
    const messageCount = new KeyCounter<Worker1MessageType>();
    const transferMap = new Map<string, StructuredSerializeOptions>();

    return async function worker1Promiser(arg0: any, arg1?: any): Promise<any> {
        const { messageType, params, transfers } = checkArgs([arg0, arg1]);
        // START at 1
        messageCount.set(messageType);
        const currentCount = messageCount.get(messageType);
        const messageId = `${messageType}#${currentCount}`;

        if (transfers) {
            transferMap.set(messageId, transfers);
        }
        return f.then((f) => f(...params));
    };
}

import { KeyCounter } from "~/sqlite-wasm/counter";
import { BetterWorker1MessageType, BetterWorker1Response, BetterWorker1ResponseError } from "~/sqlite-wasm/types";
import { Worker1Error } from "~/sqlite-wasm/worker1.error";
import {
    type Sqlite3CreateWorker1Promiser,
    type Worker1Promiser,
} from "@sqlite.org/sqlite-wasm";
// Get the Sqlite3CreateWorker1Promiser in scope
import "@sqlite.org/sqlite-wasm";

/**
 * Wrap an sqlite3 web worker with the sqlite3 `worker1promiser`
 * handle SYNCHRONOUSLY (defers the promise of the function to the first call of the promiser)
 * @param worker The worker to wrap
 * @returns The promiser-sync function
 */
export function promiserSyncV2(worker: Worker) {
    const promiserPromise = (
        globalThis as typeof globalThis & {
            sqlite3Worker1Promiser: Sqlite3CreateWorker1Promiser;
        }
    ).sqlite3Worker1Promiser.v2({
        worker,
    });
    const f = unwrap(promiserPromise);
    return f;
}

export function check<T extends BetterWorker1MessageType>(
  response: BetterWorker1Response<T> | BetterWorker1ResponseError<T>
): BetterWorker1Response<T> {
  if (response.type === "error") {
    throw new Worker1Error("main", "Unexpected response");
  }
  return response as any;
}

interface ArgsData {
    params: Parameters<Worker1Promiser>;
    transfers: StructuredSerializeOptions;
    messageType: BetterWorker1MessageType;
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
    throw new Worker1Error(
        "main",
        `invalid arguments [${arg0}, ${arg1}]`,
    );
}

function unwrap(
    f: Promise<Worker1Promiser>,
): Worker1Promiser {
    const messageCount = new KeyCounter<BetterWorker1MessageType>();
    const transferMap = new Map<string, StructuredSerializeOptions>();
    
    return async function worker1Promiser(arg0: any, arg1?: any): Promise<any> {
        const { messageType, params, transfers } = checkArgs([arg0, arg1]);
        // START at 1
        messageCount.set(messageType);
        const currentCount = messageCount.get(messageType);
        const messageId = `${messageType}#${currentCount}`;

        if (transfers) {
            transferMap.set(messageId, transfers)
        }
        return f.then((f) => f(...params));
    };
}

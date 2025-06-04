import {
    Sqlite3CreateWorker1Promiser,
    Worker1Promiser,
} from "@sqlite.org/sqlite-wasm";
import { TransferCounter } from "~/sqlite-wasm/counter";
import { BetterWorker1MessageType, BetterWorker1Response, BetterWorker1ResponseError, MESSAGE_TYPES } from "~/sqlite-wasm/types";
import { Worker1Error } from "~/sqlite-wasm/worker1/worker1.error";

export function check<T extends BetterWorker1MessageType>(
  response: BetterWorker1Response<T> | BetterWorker1ResponseError<T>
): BetterWorker1Response<T> {
  if (response.type === "error") {
    throw new Worker1Error("main", "Unexpected response");
  }
  return response as any;
}


export function promiserV2(worker: Worker) {
    const promiserPromise = (
        globalThis as typeof globalThis & {
            sqlite3Worker1Promiser: Sqlite3CreateWorker1Promiser;
        }
    ).sqlite3Worker1Promiser.v2({
        worker,
    });
    const counter = new TransferCounter<BetterWorker1MessageType>(
        MESSAGE_TYPES,
        (id, count) => `${id}#${count}`,
    );
    const f = unwrap(promiserPromise, counter);
    return f;
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
    counter: TransferCounter<BetterWorker1MessageType>,
): Worker1Promiser {
    return async function worker1Promiser(arg0: any, arg1?: any): Promise<any> {
        const { messageType, params, transfers } = checkArgs([arg0, arg1]);
        const messageId = counter.increment(messageType);
        if (transfers) counter.set(messageId, transfers);
        return f.then((f) => f(...params));
    };
}

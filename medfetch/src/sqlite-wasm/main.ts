import "./sqlite3-wasm.d.ts";
import type {
    Sqlite3CreateWorker1Promiser,
    Worker1Promiser,
} from "@sqlite.org/sqlite-wasm";

import {
    MESSAGE_TYPES,
    type BetterWorker1MessageType,
    type BetterWorker1PromiserFn,
    type BetterWorker1PromiserLazy,
} from "./types";
// import as side effect to attach "sqlite3Worker1Promiser()" to `globalThis`
// This is a workaround for named "sqlite3Worker1Promiser()" function not being recognized by webpack
import "@sqlite.org/sqlite-wasm";

import { TransferCounter } from "./counter.ts";
import { promise } from "effect/Effect";

type ArgsData = {
    params: Parameters<Worker1Promiser>;
    transfers: StructuredSerializeOptions;
    messageType: BetterWorker1MessageType;
};

/**
 * Argument validation
 * @param args The medfetch function argumens
 * @returns ArgData
 */
function checkArgs([arg0, arg1]: [any, any]): ArgsData {
    if (!arg0) throw new Error(".main.worker1: you passed 0 args lol");
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
    throw new Error(
        `better-worker1.main.checkArgs: invalid arguments [${arg0}, ${arg1}]`,
    );
}

/**
 * Defer resolving worker init promise by calling then() on it, then calling the resolved 'promiser' function.
 * @param promiser The worker1promiser function wrapped in a Promise
 * @returns The deferred async promiser worker1 function
 */
function defer(
    f: Promise<Worker1Promiser>,
    counter: TransferCounter<BetterWorker1MessageType>,
): BetterWorker1PromiserFn {
    return async function betterWorker1Promiser(
        arg0: any,
        arg1?: any,
    ): Promise<any> {
        const { messageType, params, transfers } = checkArgs([arg0, arg1]);
        const messageId = counter.increment(messageType);
        if (transfers) counter.set(messageId, transfers);
        return f.then((f) => f(...params));
    };
}

/**
 * Main thread `Promiser` function / Web Worker handler.
 */
export type BetterWorker1Promiser = BetterWorker1PromiserFn & {
    /**
     * The worker instance that this promiser was bound to by
     * {@link Sqlite3CreateWorker1Promiser.v2} from the `@sqlite.org/sqlite-wasm`
     * library.
     */
    readonly $worker: Worker;

    /**
     * Effectful version
     */
    readonly lazy: BetterWorker1PromiserLazy;
};

/**
 * Main thread ctor for the worker1 API that loads the (worker.mjs)
 * file onto a Worker thread and eagerly returns the better-worker1 promiser wrapped
 * around a sync handle.
 *
 * You probably just want to use the {@link worker1} singleton make / get function...
 * @param trace Include debug logs? (default=false)
 * @returns The extended Worker1 Promiser handle.
 */
export function w1thread(trace = false): BetterWorker1Promiser {
    const worker = new Worker(
        new URL(
            import.meta.env.DEV ? "worker1.js" : "worker1.mjs",
            import.meta.url,
        ),
        { type: "module" },
    );

    /* For managing the transfers to postMessage */
    const counter = new TransferCounter<BetterWorker1MessageType>(
        MESSAGE_TYPES,
        (id, count) => `${id}#${count}`,
    );

    const post = worker.postMessage.bind(worker);
    worker.postMessage = (msg, transfer) => {
        if (trace)
            console.log(
                "better-worker1.main.w1thread: sending with ports:",
                transfer,
            );
        const messageTransfers = counter.get(counter.tagKey(msg.type));
        if (messageTransfers) {
            return post(msg, messageTransfers);
        }
        return post(msg);
    };
    const promiser = (globalThis as any).sqlite3Worker1Promiser.v2({
        worker,
    });
    let f = defer(promiser, counter);
    (f as any).$worker = worker;
    (f as any).lazy = (...args: Parameters<BetterWorker1PromiserFn>) =>
        promise(() => f(...args));

    return f as BetterWorker1Promiser;
}

/* SINGLETON promiser handle */
let __PROMISER__: BetterWorker1Promiser | null = null;

/**
 * Getter routine for a singleton worker1 promiser, scoped to this module (main.mjs).
 * Simply checks if the global module variable {@link __PROMISER__} is null,
 * in which case it calls {@link w1thread()} and assigns the promiser to the global-module variable.
 * Otherwise, it just returns the promiser
 * @param trace Include debug logs?
 * @returns The existing promiser handle if {@link worker1} has been called previously, else returns a newly made one.
 */
export function worker1(trace = false): BetterWorker1Promiser {
    if (!__PROMISER__) __PROMISER__ = w1thread(trace);
    return __PROMISER__;
}

/**
 * Terminates {@link __PROMISER__}, if it exists, then sets it to null.
 * @returns 0 if worker is in scope, 1 otherwise
 */
export function kill(): number {
    const rc = Number(__PROMISER__ === null);
    if (__PROMISER__) __PROMISER__.$worker.terminate();
    __PROMISER__ = null;
    return rc;
}

import "./sqlite3-wasm.d.ts"; // include type extensions in the declaration output

import type {
    Sqlite3Worker1Promiser,
    Worker1Promiser,
} from "@sqlite.org/sqlite-wasm";
import {
    BetterWorker1MessageType,
    BetterWorker1PromiserFunc,
    BetterWorker1PromiserLazy,
} from "./types";
// import as side effect to attach "sqlite3Worker1Promiser()" to `globalThis`
// This is a workaround for named "sqlite3Worker1Promiser()" function not being recognized by webpack
import "@sqlite.org/sqlite-wasm";

import { Counter } from "./main.services.ts";
import { Effect } from "effect";

/**
 * Checks if window and Worker are defined in the current scope
 */
export function isBrowser() {
    return typeof window !== "undefined" && typeof Worker !== "undefined";
}

type ArgsData = {
    params: Parameters<Worker1Promiser>;
    transfers: StructuredSerializeOptions;
    messageType: BetterWorker1MessageType;
};

function checkArgs([arg0, arg1]: [any, any]): ArgsData {
    if (!arg0)
        throw new Error("better-worker1.main.worker1: you passed 0 args lol");
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
 * idk how readonly works apparently in typescript.
 */
/**
 * Defer resolving worker init promise by calling then() on it,
 * then calling the resolved 'promiser' function.
 *
 * @param promiser The PROMISIFIED worker1 api function
 * @returns The deferred async promiser worker1 function
 */
function defer(
    f: Promise<Worker1Promiser>,
    counter: Counter,
): BetterWorker1PromiserFunc {
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
export type BetterWorker1Promiser = BetterWorker1PromiserFunc & {
    /**
     * The worker instance that this promiser was bound to by
     * {@link Sqlite3Worker1Promiser.v2} from the `@sqlite.org/sqlite-wasm`
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
 * @param trace Include debug logs? Defaults to false
 * @returns The extended Worker1 Promiser handle.
 */
export function w1thread(trace = false) {
    if (isBrowser()) {
        const worker = new Worker(
            new URL(
                /* @vite-ignore */
                import.meta.env.DEV ? "worker.js" : "worker1.mjs",
                import.meta.url,
            ),
            { type: "module" },
        );

        /* For managing the transfers to postMessage */
        const counter = new Counter();

        const post = worker.postMessage.bind(worker);
        worker.postMessage = (msg, transfer) => {
            if (trace)
                console.log(
                    "better-worker1.main.w1thread: sending with ports:",
                    transfer,
                );
            const messageTransfers = counter.get(counter.messageId(msg.type));
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
        (f as any).lazy = (...args: Parameters<BetterWorker1PromiserFunc>) =>
            Effect.promise(() => f(...args));

        return f as BetterWorker1Promiser;
    } else {
        if (trace)
            console.warn(
                "better-worker1.main.worker1Thread: non-browser environment detected, returning stub function...",
            );
        return ((_: any, __: any) => void 0) as any as BetterWorker1Promiser;
    }
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

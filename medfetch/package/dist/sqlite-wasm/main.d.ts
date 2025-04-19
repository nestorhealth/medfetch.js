import "./sqlite3-wasm.d.ts";
import { BetterWorker1PromiserFunc, BetterWorker1PromiserLazy } from "./types";
import "@sqlite.org/sqlite-wasm";
/**
 * Checks if window and Worker are defined in the current scope
 */
export declare function isBrowser(): boolean;
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
export declare function w1thread(trace?: boolean): BetterWorker1Promiser;
/**
 * Getter routine for a singleton worker1 promiser, scoped to this module (main.mjs).
 * Simply checks if the global module variable {@link __PROMISER__} is null,
 * in which case it calls {@link w1thread()} and assigns the promiser to the global-module variable.
 * Otherwise, it just returns the promiser
 * @param trace Include debug logs?
 * @returns The existing promiser handle if {@link worker1} has been called previously, else returns a newly made one.
 */
export declare function worker1(trace?: boolean): BetterWorker1Promiser;
/**
 * Terminates {@link __PROMISER__}, if it exists, then sets it to null.
 * @returns 0 if worker is in scope, 1 otherwise
 */
export declare function kill(): number;

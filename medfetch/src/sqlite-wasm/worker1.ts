/// <reference lib="webworker" />
/* put import here for clarity on when we actually need the initializer */
import { Promisable } from "kysely-generic-sqlite";
/* DONT IMPORT ANY VALUES EXCEPT FOR DEFAULT!! YOU'LL SPEND HOURS LOOKING FOR A SILENT BUG!! */
import type { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { Worker1Request } from "./worker1.types.js";

type BeforeOnMessage = (
    event: MessageEvent<Worker1Request>,
    next: () => void,
) => Promisable<void>;

/**
 * Run at top level of a js script to attach the sqlite3 worker1 api to the sqlite-wasm worker thread.
 * @param sqlite3 The sqlite3 WASM interface {@link Sqlite3Static}
 * @param before What function to run before each message
 * @returns 0 on success, 1 otherwise (e.g. called from main thread)
 */
export function attach(
    sqlite3: Sqlite3Static,
    before?: BeforeOnMessage,
): 0 | 1 {
    // Attach sqlite3's `self.onmessage`
    sqlite3.initWorker1API();
    const previousHandler = self.onmessage;

    // Keep a reference to it
    const originalOnMessage = (event: MessageEvent<Worker1Request>): void =>
        previousHandler?.call(self, event);

    // Override
    self.onmessage = (event: MessageEvent<Worker1Request>) => {
        const next = () => originalOnMessage(event);
        if (before) {
            before(event, next);
        } else {
            next();
        }
    };

    return 0;
}

export function index(internalDbId: string): number {
    return parseInt(internalDbId.split("#")[1][0]) - 1;
}

/**
 * Hack to get the pointer from the dbId, despite the docs saying it's
 * not guaranteed to mean anything...
 * Based on the dist code:
 * ```ts
 * // sqlite3.mjs line 11390 (lol)
 * const getDbId = function (db) {
 *   let id = wState.idMap.get(db);
 *   if (id) return id;
 *   id = 'db#' + ++wState.idSeq + '@' + db.pointer;
 *
 *   wState.idMap.set(db, id);
 *   return id;
 * };
 * ```
 * A virtual table / any runtime loadable extension lives in memory only,
 * so the lifetime of an extension should match that of a database
 * on the heap, so this should (hopefully) be fine...
 *
 * @param internalDbId The database id assigned by the worker API
 * @returns The pointer value as a raw js number
 *
 */
export function pointer(internalDbId: string): number {
    const split = internalDbId.split("@");
    return parseInt(split[split.length - 1]);
}

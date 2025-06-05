/// <reference lib="webworker" />
/* put import here for clarity on when we actually need the initializer */
import { Promisable } from "kysely-generic-sqlite";
/* DONT IMPORT ANY VALUES EXCEPT FOR DEFAULT!! YOU'LL SPEND HOURS LOOKING FOR A SILENT BUG!! */
import type {
    Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";
import { Worker1Request } from "~/sqlite-wasm/types.patch";

type BeforeOnMessage = (event: MessageEvent<Worker1Request>, next: () => void) => Promisable<void>;

/**
 * Run at top level of a js script to run the sqlite3 worker
 * @param sqlite3 The sqlite3 WASM interface {@link Sqlite3Static}
 * @param before What function to run before each message
 * @returns 0 on success, 1 otherwise
 */
export function worker1(sqlite3: Sqlite3Static, before?: BeforeOnMessage): 0 | 1 {
    // Attach sqlite3's `self.onmessage`
    sqlite3.initWorker1API();
    const previousHandler = self.onmessage;

    // Keep a reference to it
    const originalOnMessage = (event: MessageEvent<Worker1Request>): void => previousHandler?.call(self, event);

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

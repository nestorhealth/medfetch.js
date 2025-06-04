/// <reference lib="webworker" />
/* DONT IMPORT ANY VALUES EXCEPT FOR DEFAULT!! YOU'LL SPEND HOURS LOOKING FOR A SILENT BUG!! */
import type {
    Sqlite3Static,
    WasmPointer,
    Database,
    Worker1Request,
} from "@sqlite.org/sqlite-wasm";
import { Effect, Match, pipe } from "effect";
import {
    Sqlite3InitModule,
    Sqlite3InitModuleFunc,
    Worker1Error,
    bootstrap,
    wrapSqlite3Module,
} from "./worker1.services.js";

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

/* END SQLITE-ON-WASM CUSTOM EXTENSIONS FOR WORKER */
function matchMessage<O>(
    message: BetterWorker1Request,
    handlers: MessageHandlers<O>,
) {
    return Match.value(message).pipe(
        Match.when({ type: "open" }, (open) => {
            return handlers.onOpen(open);
        }),
        Match.when({ type: "close" }, handlers.onClose),
        Match.when({ type: "exec" }, handlers.onExec),
        Match.when({ type: "export" }, handlers.onExport),
        Match.when({ type: "config-get" }, handlers.onConfigGet),
        Match.when({ type: "load-module" }, handlers.onLoadModule),
        Match.exhaustive,
    );
}

/**
 * Response wrapper
 * @param response the response data
 * @returns void, this just sends it, if we get an error, it's unexpected
 */
function response(
    response:
        | BetterWorker1Response
        | BetterWorker1Request<BetterWorker1MessageType>,
) {
    return Effect.succeed(postMessage(response));
}

/**
 * rc check in effect land
 *
 * @param sqlite3 the api
 * @param db the pointer to the database in wasm memory, or the database object itself
 * @param path the module url string, need this for the error though thats all
 * @param rc the return code
 */
function checkRc(
    sqlite3: Sqlite3Static,
    db: WasmPointer | Database | number,
    rc: number,
    operation: Worker1Error["operation"] = "load-module",
) {
    return Effect.try({
        try: (): Database | number | WasmPointer =>
            sqlite3.oo1.DB.checkRc(db, rc),
        catch: (e) => {
            if (e instanceof sqlite3.SQLite3Error) return e;
            return new Worker1Error({
                operation,
                errorName: "UNKNOWN",
                message: `better-worker1.main.checkRc: (rc=${rc}) unknown error thrown injecting the module:`,
            });
        },
    });
}

/**
 * Hack to get the pointer from the dbId, despite the docs saying it's
 * not guaranteed to mean anything...
 * Based on the dist code:
 * ```ts
 * // sqlite3.mjs line 11390
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
 * @param dbId The database id assigned by the worker API
 * @returns The pointer value as a raw js number
 *
 */
function idToPointer(dbId: string): number {
    return pipe(dbId.split("@"), (split) => split[split.length - 1], Number);
}

function doit() {
    /**
     * The onmessage handler for the worker1 function
     */
    const handleMessage = Effect.gen(function* () {
        const sqlite3InitModule = yield* Sqlite3InitModule;
        const sqlite3 = yield* bootstrap(sqlite3InitModule);

        // Get the current on message, or fail if it doesn't exist
        const tmp = yield* Effect.fromNullable(self.onmessage);

        // Wrap it
        const onBaseMessage = (e: MessageEvent<BetterWorker1Request>): void =>
            tmp.call(self, e);

        // New onMessage handler function
        const onMessage = (event: MessageEvent<BetterWorker1Request>) => {
            return matchMessage(event.data, {
                onOpen: () => {
                    onBaseMessage(event);
                },
                onClose: () => onBaseMessage(event),
                onExec: () => {
                    onBaseMessage(event);
                },
                onConfigGet: () => onBaseMessage(event),
                onExport: () => onBaseMessage(event),

                /* custom event handlers starts here */
                onLoadModule: async ({ dbId, args, messageId }) =>
                    await Effect.gen(function* () {
                        if (!dbId) {
                            return yield* new Worker1Error({
                                operation: "load-module",
                                message: `you have no database opened lol`,
                                errorName: "BAD_CALL",
                            });
                        }
                        if (args === undefined) {
                            return yield* new Worker1Error({
                                operation: "load-module",
                                message: `"message.args" can't be undefined when invoking load-module`,
                                errorName: "BAD_CALL",
                            });
                        }

                        const pdb = idToPointer(dbId);
                        sqlite3.wasm.allocPtr(1); // malloc() for pAux
                        const userModule = yield* wrapSqlite3Module(
                            sqlite3,
                            args.moduleURL,
                            {
                                aux: args.aux,
                                transfer: event.ports,
                            },
                        );
                        // @ts-ignore - idk why this is callable at runtime but
                        // the sqlite3 wasm types indicate it as an object...
                        const vtabMod = sqlite3.vtab.setupModule({
                            methods: userModule,
                        });

                        // user aux pointer if they have any data
                        // pAux only lives for the xCreate call,
                        // so we'll let sqlite's scope api handle destroying it
                        let rc = 0;
                        let pAux: WasmPointer = 0;
                        try {
                            if (args.pAuxBytes) {
                                const size = args.pAuxBytes.byteLength;
                                pAux = sqlite3.wasm.alloc(size);
                                if (pAux === 0) {
                                    rc = -1;
                                    throw new Error(); // throw to get to finally block
                                }
                                const view = new DataView(
                                    sqlite3.wasm.heap8u().buffer,
                                    pAux,
                                    4,
                                );
                                // write in size from bytes 0 - 4 (supports up to 2^31 bits)
                                view.setInt32(
                                    0,
                                    args.pAuxBytes.byteLength,
                                    true,
                                ); // little endian
                                sqlite3.wasm
                                    .heap8u()
                                    .set(args.pAuxBytes, pAux + 4);
                            }
                            rc = sqlite3.capi.sqlite3_create_module(
                                pdb,
                                args.moduleName,
                                vtabMod.pointer,
                                pAux,
                            );
                        } finally {
                            if (rc === -1) {
                                return yield* new Worker1Error({
                                    message: `better-worker1.worker1: stack can't handle ${args.pAuxBytes?.byteLength} more bytes`,
                                    errorName: "NO_MEM",
                                    operation: "load-module",
                                });
                            }
                        }

                        // will short circut if rc != 0
                        yield* checkRc(sqlite3, pdb, rc);

                        // workaround: just use the 'exec' type
                        // which i didn't bother typing out for now
                        // so the promise actually resolves
                        return yield* response({
                            type: "exec",
                            dbId,
                            messageId: messageId!,
                            result: {
                                //@ts-ignore
                                operation: "load-module",
                                rc,
                                moduleName: args.moduleName,
                            },
                        });
                    }).pipe(Effect.runPromise),
            });
        };
        return onMessage;
    });
    const worker1Effect = handleMessage.pipe(
        Effect.tap((onMessage) => {
            self.onmessage = onMessage;
        }),
    );

    // @ts-ignore
    const _ = Effect.provideService(
        worker1Effect,
        Sqlite3InitModule,
        init,
    ).pipe(Effect.runPromiseExit);
}

/* The worker's main routine — it performs a one-time WASM initialization.
 * There's no need for a manual loop here; the worker thread stays alive and
 * handles messages via its onmessage handler. */

import {
    type MessageHandlers,
    type BetterWorker1Request,
    type BetterWorker1Response,
    type BetterWorker1MessageType,
} from "./types.js";

/* put import here for clarity on when we actually need the initializer */
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { Promisable } from "kysely-generic-sqlite";

const init: Sqlite3InitModuleFunc =
    sqlite3InitModule as unknown as Sqlite3InitModuleFunc;

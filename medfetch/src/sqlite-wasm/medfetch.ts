import { Data, Effect } from "effect";
import { isBrowser, worker1 } from "./main.js";
import { BetterWorker1MessageType } from "./types.js";

const DEV = import.meta.env.DEV;

function ModuleURL(url?: URL) {
    if (window === undefined) {
        return new URL("file:///dev/null");
    }
    if (url) return url;
    else
        return new URL(
            // namespace for extension in static folder
            DEV ? "medfetch.vtab.js" : "sqlite-ext/medfetch.vtab.mjs",
            // relative to source  : relative to static root
            DEV ? import.meta.url : self.location.origin,
        );
}

/**
 * User config for invoking `medfetch()` with sqlite-wasm
 */
interface MedfetchSqliteWasmOptions {
    /**
     * If provided, overrides the default path of
     * `/public/sqlite-ext/medfetch.vtab.mjs`.
     */
    moduleURL?: URL;

    /**
     * Want dev logs?
     */
    trace?: boolean;

    /**
     * What filename to attach to
     */
    filename?: string;
    
    /**
     * Attach to an existing database?
     */
    dbId?: string;
}

export class SqliteWasmError extends Data.TaggedError("medfetch/sqlite-wasm")<{
    readonly message?: string;
    readonly type: BetterWorker1MessageType;
}> {
    constructor({ message, type }: { message?: string; type: BetterWorker1MessageType }) {
        super({ type, message: `[medfetch/sqlite-wasm]: ${message ?? "Unknown error."}` });
    }
}

type SQLFn<E, R, Templated = any> = <T = unknown>(
    strings: TemplateStringsArray,
    ...rest: Templated[]
) => Effect.Effect<T[], E, R>;

let __DB_ID__: string | undefined;

function getFetchWorkerPort() {
    return Effect.promise(
        () =>
            new Promise<MessagePort>((resolve, reject) => {
                const { port1, port2 } = new MessageChannel();
                const fetchWorker = new Worker(
                    new URL(
                        import.meta.env.DEV
                            ? "../fetch"
                            : "../fetch.mjs",
                        import.meta.url,
                    ),
                    { type: "module" },
                );
                const onMessage = (e: MessageEvent) => {
                    if (
                        e.data === "fetch-ready" ||
                        e.data?.type === "fetch-ready"
                    ) {
                        port1.removeEventListener("message", onMessage);
                        resolve(port1);
                    } else {
                        port1.removeEventListener("message", onMessage);
                        reject(
                            new Error(
                                `Unexpected message: ${JSON.stringify(e.data)}`,
                            ),
                        );
                    }
                };
                port1.addEventListener("message", onMessage);
                port1.start();
                fetchWorker.postMessage(
                    {
                        type: "init",
                    },
                    [port2],
                );
            }),
    );
}

/**
 * Loads in sqlite3 Web Assembly binary via the []()
 * wrapper handle, loads in the virtual table module,
 * then returns back an sql template string function for querying
 * the database.
 * @param baseURL The fhir server base url
 * @param options
 */
export function medfetch(
    baseURL: string,
    { trace = false, filename, dbId }: MedfetchSqliteWasmOptions = {},
): SQLFn<SqliteWasmError, never> {
    if (!isBrowser()) {
        if (trace) {
            console.warn(
                `[medfetch/sqlite-wasm]: non-browser environment detected, returning stub function...`,
            );
        }
        return ((_: any, ...__: any[]) => void 0) as any;
    }

    const loadMedfetch = Effect.gen(function* () {
        if (__DB_ID__) {
            return __DB_ID__;
        } else {
            const promiser = worker1(import.meta.env.DEV);
            if (!dbId) {
                if (filename) {
                    const { dbId: newDbId } = yield* promiser.lazy("open", {
                        vfs: "opfs",
                        filename,
                    });
                    dbId = yield* Effect.fromNullable(newDbId);
                } else {
                    const { dbId: newDbId } = yield* promiser.lazy("open");
                    dbId = yield* Effect.fromNullable(newDbId);
                }
            }
            const port1 = yield* getFetchWorkerPort();
            const { result } = yield* promiser.lazy(
                {
                    dbId,
                    type: "load-module",
                    args: {
                        moduleURL: ModuleURL().toString(),
                        moduleName: "medfetch",
                        aux: new TextEncoder().encode(baseURL),
                    },
                },
                [port1],
            );
            if (result.rc !== 0) {
                return yield* new SqliteWasmError({
                    message: `Unable to load in vtab module at ${ModuleURL().toString()}`,
                    type: "load-module",
                });
            }
            __DB_ID__ = dbId;
            return __DB_ID__;
        }
    });

    return function sql<T = unknown>(
        strings: TemplateStringsArray,
        ...rest: any[]
    ) {
        const querystring = strings.reduce(
            (acc, str, i) => acc + str + (rest[i] ?? ""),
            "",
        );
        return Effect.gen(function* () {
            let start = 0;
            if (trace) {
                start = performance.now();
                console.log(`[medfetch/sqlite-wasm] executing SQL: ${querystring}`);
            }

            const dbId = yield* loadMedfetch;
            const { result } = yield* worker1().lazy({
                type: "exec",
                dbId,
                args: {
                    sql: querystring,
                    rowMode: "object",
                },
            });
            
            if (trace) {
                const elapsed = performance.now() - start;
                console.log(`[medfetch/sqlite-wasm] query completed in ${elapsed.toFixed(2)}ms`);
            }
            return result.resultRows as T[];
        });
    } as any;
}

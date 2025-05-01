import { Data, Effect } from "effect";
import { isBrowser, worker1 } from "./main.js";
import { BetterWorker1MessageType } from "./types.js";
import { TokenMessage } from "~/sqlite-wasm/vtab.services.js";

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
    
    getAccessToken?: () => Promise<string>;
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

function createFetchChannel(): Effect.Effect<MessagePort> {
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

function createTokenChannel(getAccessToken: () => Promise<string>): Effect.Effect<MessagePort> {
    return Effect.promise(() =>
        new Promise<MessagePort>((resolve, reject) => {
            const { port1, port2 } = new MessageChannel();

            port1.onmessage = (event) => {
                return TokenMessage.$match(event.data, {
                    async tokenExpired({ sab }) {
                        const signal = new Int32Array(sab, 0, 1);  // 4B at offset 0
                        const status = new Int32Array(sab, 4, 1);  // 4B at offset 4
                        const buffer = new Uint8Array(sab, 8);    // remainder is token bytes

                        try {
                            const accessToken = await getAccessToken();
                            // Write token to SAB
                            const encoded = new TextEncoder().encode(accessToken);
                            buffer.fill(0); // clear first
                            buffer.set(encoded.slice(0, buffer.length)); // truncate if too long
                            status[0] = 1; // signal success
                        } catch (e) {
                            status[0] = -1;
                        }

                        Atomics.store(signal, 0, 1); // mark ready
                        Atomics.notify(signal, 0);   // wake the waiting thread
                    },

                    error(data) {
                        reject(data);
                    },
                });
            };

            resolve(port2); // give worker this end
        })
    );
}

/**
 * Loads in sqlite3 Web Assembly binary by calling the {@link worker1} function, 
 * loads in the virtual table module, then returns back an sql template string function 
 * for querying the database. Call this from the main thread!
 * @param baseURL The fhir server base url
 * @param options Optional config
 * @returns An effectful SQL client with signature {@link SQLFn}
 */
export function medfetch(
    baseURL: string,
    { trace = false, filename, dbId, getAccessToken }: MedfetchSqliteWasmOptions = {},
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
                    dbId = yield *Effect.fromNullable(newDbId);
                } else {
                    const { dbId: newDbId } = yield* promiser.lazy("open");
                    dbId = yield *Effect.fromNullable(newDbId);
                }
            }
            const fetchPort = yield *createFetchChannel();
            const transfers = [fetchPort];
            if (getAccessToken) {
                const tokenPort = yield *createTokenChannel(getAccessToken);
                transfers.push(tokenPort);
            }
            const { result } = yield* promiser.lazy(
                {
                    dbId,
                    type: "load-module",
                    args: {
                        moduleURL: ModuleURL().toString(),
                        moduleName: "medfetch",
                        aux: { baseURL }
                    },
                },
                transfers
            );
            if (result.rc !== 0) {
                return yield *new SqliteWasmError({
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
                console.log(`[medfetch/sqlite-wasm]: executing SQL ("${querystring}")`);
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
                console.log(`[medfetch/sqlite-wasm]: query completed in ${elapsed.toFixed(2)}ms`);
            }
            return result.resultRows as T[];
        });
    } as any;
}

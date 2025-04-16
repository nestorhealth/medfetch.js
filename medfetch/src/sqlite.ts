import { Data, Effect } from "effect";
import { isBrowser, ow, SqliteowResponseError } from "sqliteow";
import { lazy } from "sqliteow/services";

const DEV = import.meta.env.DEV;

export function ModuleURL(url?: URL) {
    if (url)
        return url;
    else
        return new URL(
            // namespace for extension in static folder
            DEV ? "sqlite.vtab.js" : "medfetch.vtab.js", 
            // relative to source  : relative to static root
            DEV ? import.meta.url : self.location.origin
        );
}

interface MedfetchOptions {
    /**
     * `medfetch()` will create establish the ready handshake
     * with this worker by creating a MessageChannel and passing
     * the port to the Virtual Table module.
     *
     */
    fetcher: Worker;

    /**
     * If provided, overrides the default path of
     * `/public/ow-ext/medfetch.vtab.mjs`.
     */
    moduleURL?: URL;

    trace?: boolean;
}

export class MedfetchSqliteError extends Data.TaggedError("medfetch.sqlite")<{
    message?: string;
}> {}

/**
 * Loads in sqlite3 Web Assembly binary via the [sqliteow]()
 * wrapper handle, loads in the virtual table module,
 * then returns back an sql template string function for querying
 * the database.
 * @param baseURL The fhir server base url
 * @param options
 */
export function medfetch(
    baseURL: string,
    { fetcher, moduleURL, trace = false }: MedfetchOptions,
) {
    if (!isBrowser()) {
        if (trace)
            console.warn(
                `medfetch: non-browser environment detected, returning stub function...`,
            );
    }

    const sqlite3 = ow();
    const handle = lazy(sqlite3);
    const { port1, port2 } = new MessageChannel();
    const FETCH_PORT_KEY = "FETCH_PORT";

    // 1. Start fetch worker and await 'ready'
    const fetcherReady = new Promise<void>((resolve, reject) => {
        port2.onmessage = (event: MessageEvent) => {
            if (event.data === "ready") {
                if (trace)
                    console.log("medfetch: Fetch Worker ready!")
                resolve();
            }
            else reject(new Error("Unexpected message from fetcher"));
        };
        fetcher.postMessage({ type: "init" }, [port2]);
    });

    // 2. Register port with sqlite worker
    const portRegistered = new Promise<void>((resolve, _reject) => {
        const handleMessage = (event: MessageEvent) => {
            if (
                event.data?.type === "exec" &&
                event.data.result.key === FETCH_PORT_KEY
            ) {
                sqlite3.$worker.removeEventListener("message", handleMessage);
                resolve();
            }
        };
        sqlite3.$worker.addEventListener("message", handleMessage);
        sqlite3.$worker.postMessage(
            { type: "ow-register-port", args: { key: FETCH_PORT_KEY } },
            [port1],
        );
    });

    // 3. Wait for both workers to be ready
    const init = Promise.all([fetcherReady, portRegistered]).then(() =>
        handle({ type: "open" })
            .pipe(
                Effect.andThen(({ dbId }) =>
                    handle({
                        type: "ow-load-module",
                        dbId,
                        args: {
                            moduleURL: ModuleURL(moduleURL).toString(),
                            moduleName: "medfetch",
                            aux: new TextEncoder().encode(baseURL),
                        },
                    }),
                ),
            )
            .pipe(Effect.runPromise),
    );

    return function sql<T = unknown>(
        strings: TemplateStringsArray,
        ...exprs: any[]
    ): Effect.Effect<T[], SqliteowResponseError> {
        return Effect.gen(function* () {
            const { dbId } = yield* Effect.promise(() => init);
            const text = strings.reduce(
                (acc, str, i) => acc + str + (exprs[i] ?? ""),
                "",
            );
            return yield* handle({
                type: "exec",
                dbId,
                args: {
                    sql: text,
                },
            }).pipe(Effect.andThen(({ result }) => result.resultRows as T[]));
        });
    };
}

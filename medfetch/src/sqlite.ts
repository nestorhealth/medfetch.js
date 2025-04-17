import { Data, Effect } from "effect";
import { isBrowser, worker1 } from "better-worker1";
import { BetterWorker1MessageType } from "better-worker1/types";

const DEV = import.meta.env.DEV;

export function ModuleURL(url?: URL) {
    if (url)
        return url;
    else
        return new URL(
            // namespace for extension in static folder
            DEV ? "sqlite.vtab.js" : "sqlite-ext/medfetch.vtab.mjs", 
            // relative to source  : relative to static root
            DEV ? import.meta.url : self.location.origin
        );
}

interface MedfetchOptions {
    /**
     * If provided, overrides the default path of
     * `/public/sqlite-ext/medfetch.vtab.mjs`.
     */
    moduleURL?: URL;

    trace?: boolean;

    filename?: string;
}

export class MedfetchSqliteError extends Data.TaggedError("medfetch.sqlite")<{
    message?: string;
    type: BetterWorker1MessageType;
}> {};

type SQLFn<
    E,
    R,
    Templated = any,
> = <T = unknown>(strings: TemplateStringsArray, ...rest: Templated[]) => Effect.Effect<T[], E, R>;


function getFetchWorkerPort(){
    return Effect.promise(() => new Promise<MessagePort>((resolve, reject) => {
        const { port1, port2 } = new MessageChannel();
        const fetchWorker = new Worker(
            new URL(import.meta.env.DEV ?
            "fetch-worker"
            : "fetch-worker.mjs", import.meta.url),
            { type: "module" }
        );
        const onMessage = (e: MessageEvent) => {
            if (e.data === "fetch-ready" || e.data?.type === "fetch-ready") {
                port1.removeEventListener("message", onMessage);
                resolve(port1);
            } else {
                port1.removeEventListener("message", onMessage);
                reject(new Error(`Unexpected message: ${JSON.stringify(e.data)}`));
            }
        };
        port1.addEventListener("message", onMessage);
        port1.start();
        fetchWorker.postMessage({ 
            type: "init"
        }, [port2]);
    }));
}

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
    { trace = false, filename }: MedfetchOptions = {},
): SQLFn<MedfetchSqliteError, never> {
    if (!isBrowser()) {
        if (trace) {
            console.warn(
                `medfetch: non-browser environment detected, returning stub function...`,
            );
        }
        return ( (_: any, ...__: any[]) => void 0 ) as any;
    }

    const loadMedfetch = Effect.gen(function*() {
        const promiser = worker1();
        let dbId: string | undefined = undefined;
        if (filename) {
            const { dbId: tmp } = yield *promiser.lazy("open", {
                vfs: "opfs",
                filename
            });
            dbId = tmp;
        } else {
            const { dbId: tmp } = yield *promiser.lazy("open");
            dbId = tmp;
        }
        const memoized = yield* Effect.cachedFunction(getFetchWorkerPort);
        const port1 = yield* memoized(dbId);

        const { result: { rc } }= yield *promiser.lazy({
            dbId,
            type: "load-module",
            args: {
                moduleURL: ModuleURL().toString(),
                moduleName: "medfetch",
                aux: new TextEncoder().encode(baseURL)
            }
        }, [port1]);
        if (rc !== 0) {
            return yield* new MedfetchSqliteError({
                message: `medfetch.sqlite: couldn't load in the module at ${ModuleURL().toString()}`,
                type: "load-module"
            });
        }
        return dbId;
    });

    return function sql<T = unknown>(strings: TemplateStringsArray, ...rest: any[]) {
        const querystring = strings.reduce((acc, str, i) => acc + str + (rest[i] ?? ""), "");
        return Effect.gen(function* () {
            const dbId = yield *loadMedfetch;
            const { result } = yield *worker1().lazy({
                type: "exec",
                dbId,
                args: {
                    sql: querystring,
                    rowMode: "object"
                }
            });
            return result.resultRows as T[];
        });
    } as any;
}

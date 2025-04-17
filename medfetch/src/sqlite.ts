import { Data } from "effect";
import { BetterWorker1Promiser, isBrowser, worker1 } from "better-worker1";

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
}> {};


/**
 * Loads in sqlite3 Web Assembly binary via the [sqliteow]()
 * wrapper handle, loads in the virtual table module,
 * then returns back an sql template string function for querying
 * the database.
 * @param baseURL The fhir server base url
 * @param options
 */
export async function medfetch(
    baseURL: string,
    { trace = false, filename }: MedfetchOptions = {},
): Promise<BetterWorker1Promiser> {
    if (!isBrowser()) {
        if (trace) {
            console.warn(
                `medfetch: non-browser environment detected, returning stub function...`,
            );
        }
        return ( (_: any, ...__: any[]) => void 0 ) as any;
    }

    const { port1, port2 } = new MessageChannel();
    const fetchWorker = new Worker(
        new URL(import.meta.env.DEV ?
        "fetch-worker"
        : "fetch-worker.mjs", import.meta.url),
        { type: "module" }
    );
    fetchWorker.postMessage({ 
        type: "init"
    }, [port2]);
    const ready = new Promise<void>((resolve, reject) => {
        const onMessage = (e: MessageEvent) => {
            if (e.data === "fetch-ready" || e.data?.type === "fetch-ready") {
                port1.removeEventListener("message", onMessage);
                resolve();
            } else {
                port1.removeEventListener("message", onMessage);
                reject(new Error(`Unexpected message: ${JSON.stringify(e.data)}`));
            }
        };
        port1.addEventListener("message", onMessage);
        port1.start();
    });
    await ready;

    const promiser = worker1();

    let dbId: string | undefined = undefined;
    if (filename) {
        const { dbId: tmp } = await promiser("open", {
            vfs: "opfs",
            filename
        });
        dbId = tmp;
    } else {
        const { dbId: tmp } = await promiser("open");
        dbId = tmp;
    }

    await promiser({
        dbId,
        type: "load-module",
        args: {
            moduleURL: ModuleURL().toString(),
            moduleName: "medfetch",
            aux: new TextEncoder().encode(baseURL)
        }
    }, [port1]);

    console.log("ok!");
    return promiser;
}

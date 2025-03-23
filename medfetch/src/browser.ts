import { Data, Effect, Match } from "effect";
import { SqliteIn, SqliteOutError, SqliteOutReady, SqliteOutResult } from "./workers/sqlite";
import { spawn } from "./worker";

class MedfetchUnknownError extends Data.TaggedError("MedfetchUnknownError") {};
class MedfetchLoadError extends Data.TaggedError("MedfetchLoadError")<{ message: string }> {};

const getOnMessageReady = (worker: Worker, resolve: (data: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => 
    function handle(e: MessageEvent<SqliteOutReady | SqliteOutError>) {
        return Match.value(e.data).pipe(
            Match.when({ _tag: "ready" }, () => {
                worker.removeEventListener("message", handle);
                resolve();
            }),
            Match.orElse(({ message }) => {
                worker.removeEventListener("message", handle);
                reject(message);
            })
        )
    }

const getOnMessageResult = (worker: Worker, resolve: (data: any[] | PromiseLike<any[]>) => void, reject: (reason?: any) => void) =>
    function handle(e: MessageEvent<SqliteOutResult | SqliteOutError>) {
        return Match.value(e.data).pipe(
            Match.when({ _tag: "result" }, ({ data }) => {
                worker.removeEventListener("message", handle);
                resolve(data);
            }),
            Match.orElse(({ message }) => {
                window.removeEventListener("message", handle);
                reject(message);
            })
        )
    }

export function medfetch(baseUrl: string) {
    return Effect.gen(function* () {
        const sqliteWorker = yield* spawn("./workers/sqlite.js");
        const fetchWorker = yield* spawn("./workers/fetch.js");
        const channel = new MessageChannel();
        yield* Effect.tryPromise({
            try: () => new Promise<void>((resolve, reject) => {
                const onMessage = getOnMessageReady(sqliteWorker, resolve, reject);
                sqliteWorker.addEventListener("message", onMessage);

                sqliteWorker.postMessage(
                    SqliteIn.init({ 
                        baseUrl
                    }), [ channel.port1 ]
                );
                fetchWorker.postMessage(null, [ channel.port2 ]);
            }),
            catch: (e) => {
                if (!(e instanceof Error)) {
                    return new MedfetchUnknownError();
                }
                return new MedfetchLoadError({ message: e.message });
            }
        });
        const sql = (text: string) => new Promise<any[]>((resolve, reject) => {
            const onMessage = getOnMessageResult(sqliteWorker, resolve, reject);
            sqliteWorker.addEventListener("message", onMessage);
            sqliteWorker.postMessage(
                SqliteIn.query({ text })
            );
            return void 0;
        });
        return { $worker: sqliteWorker, sql };
    });
}

export const medfetchAsync = async (baseUrl: string) => Effect.runPromise(medfetch(baseUrl));

// can load the extension into a wasm sqlite instance using await
// const { sql } = await medfetchAsync("https://r4.smarthealthit.org");

// example of using the sql query API in the browser
// window.runQuery = async () => {
//     const query = document.getElementById("query") as HTMLTextAreaElement;
//     if (query) {
//         const result = await sql(query.value);
//         console.log("here!", result);
//     }
// }

/// <reference lib="webworker" />

import sqliteOnWasm, { type Database } from "@sqlite.org/sqlite-wasm";
import { Data, Effect, pipe } from "effect";
import { medfetchModule } from "./medfetch";

/* Each worker is responsible for exactly 1 database */
let db: Database;

/* Messages */

/**
 * The possible message input types
 * for the `.data` field
 */
export type SqliteIn = Data.TaggedEnum<{
    init: { baseUrl: string };
    query: { text: string; rowMode?: "array" | "object" }
}>;
export type SqliteInInit = ReturnType<typeof SqliteIn.init>;
export type SqliteInQuery = ReturnType<typeof SqliteIn.query>;

export const SqliteIn = Data.taggedEnum<SqliteIn>();


/* Outgoing messages from Sqlite to the main thread */
export type SqliteOut = Data.TaggedEnum<{
    result: { data: any[] };
    ready: {};
    error: { message: string; };
}>;
export type SqliteOutResult = ReturnType<typeof SqliteOut.result>;
export type SqliteOutReady = ReturnType<typeof SqliteOut.ready>;
export type SqliteOutError = ReturnType<typeof SqliteOut.error>;

/**
 * The SqliteOut enum constructor "super object".
 *
 * @field result `SqliteOutResult` ctor
 * @field ready `SqliteOutReady` ctor
 * @field error `SqliteOutError` ctor
 */
export const SqliteOut = Data.taggedEnum<SqliteOut>();

export type SqliteMessage = SqliteIn | SqliteOut;

const post = <T>(data: T) => 
    Effect.try(() => postMessage(data));

onmessage = async (msg: MessageEvent<SqliteIn>) => {
    const { data, ports } = msg;
    if (data._tag === "init") {
        const fetcher = ports[0];
        if (!fetcher) {
            throw new Error("(medfetch::sqlite): expected the fetch worker port but got nothing");
        }
        const sqlite3 = await sqliteOnWasm();
        const { capi, oo1, vtab } = sqlite3;

        db = new oo1.DB();
        if (db.pointer === undefined) {
            throw new Error("sqlite db was not properly initialized!");
        }
        const loader = medfetchModule(sqlite3, fetcher).pipe(
            Effect.map(
                vtable => pipe(
                    vtab.setupModule(vtable) as any,
                    ({ pointer }) => db.checkRc(capi.sqlite3_create_module(db.pointer, "medfetch", pointer, 0)),
                )
            )
        );
        Effect.runSync(loader);
        Effect.runSync(post(SqliteOut.ready()));
    }

    if (data._tag === "query") {
        const { text } = data;
        console.log("ok!", text);
        try {
            const stmt = db.prepare(text);
            const data = [];
            while (stmt.step()) {
                data.push(stmt.get({}));
            }

            Effect.runSync(post(SqliteOut.result({ data })));
        } catch (error) {
            if (error instanceof Error) {
                Effect.runSync(post(SqliteOut.error({ message: error.message })));
            } else {
                Effect.runSync(post(SqliteOut.error({ message: "medfetch: unknown runtime exception happened while executing the query"})));
            }
        }
    }
}


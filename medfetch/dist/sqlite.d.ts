import { Effect } from "effect";
import { SqliteowResponseError } from "sqliteow";
export declare function ModuleURL(url?: URL): URL;
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
declare const MedfetchSqliteError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "medfetch.sqlite";
} & Readonly<A>;
export declare class MedfetchSqliteError extends MedfetchSqliteError_base<{
    message?: string;
}> {
}
/**
 * Loads in sqlite3 Web Assembly binary via the [sqliteow]()
 * wrapper handle, loads in the virtual table module,
 * then returns back an sql template string function for querying
 * the database.
 * @param baseURL The fhir server base url
 * @param options
 */
export declare function medfetch(baseURL: string, { fetcher, moduleURL, trace }: MedfetchOptions): <T = unknown>(strings: TemplateStringsArray, ...exprs: any[]) => Effect.Effect<T[], SqliteowResponseError>;
export {};

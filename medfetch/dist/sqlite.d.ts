import { BetterWorker1Promiser } from "better-worker1";
export declare function ModuleURL(url?: URL): URL;
interface MedfetchOptions {
    /**
     * If provided, overrides the default path of
     * `/public/sqlite-ext/medfetch.vtab.mjs`.
     */
    moduleURL?: URL;
    trace?: boolean;
    filename?: string;
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
export declare function medfetch(baseURL: string, { trace, filename }?: MedfetchOptions): Promise<BetterWorker1Promiser>;
export {};

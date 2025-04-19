import { Context, Effect } from "effect";
import type { sqlite3_module, Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { UnknownException } from "effect/Cause";
declare const Sqlite3BootstrapError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "better-worker1.services.Sqlite3BootstrapError";
} & Readonly<A>;
/**
 * indicate an issue with the bootstrapping
 * proc
 *
 * @prop message   - user friendly text
 * @prop errorName - the name of the actual caught error
 * @prop phase     - what point was the error returned?
 */
export declare class Sqlite3BootstrapError extends Sqlite3BootstrapError_base<{
    message?: string;
    errorName?: string;
    phase: "wasm" | "worker1API";
}> {
}
/**
 * Default export type
 */
type Sqlite3InitModuleFunc = (typeof import("@sqlite.org/sqlite-wasm"))["default"];
declare const Sqlite3InitModule_base: Context.TagClass<Sqlite3InitModule, "better-worker1.services.Sqlite3InitModule", typeof import("@sqlite.org/sqlite-wasm").default>;
/**
 * Now make it a service
 */
export declare class Sqlite3InitModule extends Sqlite3InitModule_base {
}
declare const BetterSqlite3Static_base: Context.TagClass<BetterSqlite3Static, "better-worker1.services.BetterSqlite3Static", Sqlite3Static>;
/**
 * The Effect version
 */
export declare class BetterSqlite3Static extends BetterSqlite3Static_base {
}
/**
 * bootstrap the sqlite3 es module default export and
 * reflect back the onmessage handler
 *
 * @param mod - the ESM default export of sqlite-wasm
 * @returns   a Worker Handle, which is just the sqlite3
 *            static object and its onmessage reflected back
 */
export declare const bootstrap: (mod: Sqlite3InitModuleFunc) => Effect.Effect<Sqlite3Static, Sqlite3BootstrapError, never>;
export interface ModuleAux {
    transfer?: StructuredSerializeOptions | readonly Transferable[];
    preload: any[];
}
/**
 * The expected type of a user's virtual table module.
 * Must be a default export. Async is optional but is there
 * to accomodate any async workflows that need to be finished prior to
 * creating the vtable methods.
 * @param sqlite3 The sqlite3 WASM interface
 * @param aux Module aux, if you passed anything
 * @returns vtab A `sqlite3_module` Promise
 */
export type VirtualTableExtensionFn = (sqlite3: Sqlite3Static, aux?: ModuleAux) => Promise<sqlite3_module>;
declare const LoadModuleError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "better-worker1.worker.LoadModule";
} & Readonly<A>;
export declare class LoadModuleError extends LoadModuleError_base<{
    message?: string;
    errorName?: string;
    path: string;
    code: "BAD_CALL" | "BAD_DB_HANDLE" | "NO_SUCH_PATH" | "NO_DEFAULT_EXPORT" | "NO_MEM" | "TYPE_MISMATCH_DEFAULT_EXPORT" | "SQLITE_INTERNAL" | "UNKNOWN";
}> {
}
/**
 * For getting a runtime virtual table URL
 * @param moduleURL The pathstring to the es module
 * @param aux Any helper data for the Virtual Table extension function
 * @returns the virtual table sqlite3_module
 * @throws {@link BetterModuleLoadError} | UnknownException
 */
export declare function wrapSqlite3Module(sqlite3: Sqlite3Static, moduleURL: string, aux?: ModuleAux): Effect.Effect<sqlite3_module, LoadModuleError | UnknownException>;
export {};

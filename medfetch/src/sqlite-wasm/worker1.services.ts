import { Context, Data, Effect } from "effect";
import type { sqlite3_module, Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { UnknownException } from "effect/Cause";

/**
 * indicate an issue with the bootstrapping
 * proc
 *
 * @prop message   - user friendly text
 * @prop errorName - the name of the actual caught error
 * @prop phase     - what point was the error returned?
 */
export class Sqlite3BootstrapError extends Data.TaggedError(
    "better-worker1.services.Sqlite3BootstrapError",
)<{
    message?: string;
    errorName?: string;
    phase: "wasm" | "worker1API";
}> {}

/**
 * Default export type
 */
type Sqlite3InitModuleFunc =
    (typeof import("@sqlite.org/sqlite-wasm"))["default"];

/**
 * Now make it a service
 */
export class Sqlite3InitModule extends Context.Tag(
    "better-worker1.services.Sqlite3InitModule",
)<Sqlite3InitModule, Sqlite3InitModuleFunc>() {}

/**
 * The Effect version
 */
export class BetterSqlite3Static extends Context.Tag(
    "better-worker1.services.BetterSqlite3Static",
)<BetterSqlite3Static, Sqlite3Static>() {}

/**
 * Loads the sqlite3 wasm API via the default ESM module export
 *
 * @param wasmLoader The default export function of @sqlite/sqlite-wasm
 */
function load(wasmLoader: Sqlite3InitModuleFunc) {
    return Effect.tryPromise({
        try: () =>
            wasmLoader({
                print: console.log,
                printErr: console.error,
            }),
        catch: (e) => {
            if (e instanceof Error) {
                return new Sqlite3BootstrapError({
                    phase: "wasm",
                    message: e.message,
                    errorName: e.name,
                });
            } else {
                return new Sqlite3BootstrapError({
                    phase: "wasm",
                    message: `sqliteow: unknown error ${e} thrown while loading the wasm module`,
                });
            }
        },
    });
}

/**
 * sqlite3 init routine for wasm
 * first it calls the sqlite3InitModule default export,
 * then inits the worker1API, so this MUST
 * be called from a worker.
 *
 * @yields the sqlite3 wasm api object
 */
const init = Sqlite3InitModule.pipe(
    Effect.andThen(load),
    Effect.tap((sqlite3) => sqlite3.initWorker1API()),
);

/**
 * bootstrap the sqlite3 es module default export and
 * reflect back the onmessage handler
 *
 * @param mod - the ESM default export of sqlite-wasm
 * @returns   a Worker Handle, which is just the sqlite3
 *            static object and its onmessage reflected back
 */
export const bootstrap = (mod: Sqlite3InitModuleFunc) =>
    init.pipe(Effect.provideService(Sqlite3InitModule, mod));

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
export type VirtualTableExtensionFn = (
    sqlite3: Sqlite3Static,
    aux?: ModuleAux,
) => Promise<sqlite3_module>;

export class LoadModuleError extends Data.TaggedError(
    "better-worker1.worker.LoadModule",
)<{
    message?: string;
    errorName?: string;
    path: string;
    code:
        | "BAD_CALL"
        | "BAD_DB_HANDLE"
        | "NO_SUCH_PATH"
        | "NO_DEFAULT_EXPORT"
        | "NO_MEM"
        | "TYPE_MISMATCH_DEFAULT_EXPORT"
        | "SQLITE_INTERNAL"
        | "UNKNOWN";
}> {}

const dynamicImport = (path: string) =>
    Effect.tryPromise({
        try: async () =>
            await import(
                // so esbuild, rollup, and webpack static
                // analyzers do not fail at runtime
                /* @vite-ignore */
                /* webpackIgnore: true */
                path
            ),
        catch: (e) => {
            if (!(e instanceof Error)) {
                return new LoadModuleError({
                    message: `sqliteow: unknown error occurred while loading dynamic import`,
                    code: "UNKNOWN",
                    path,
                });
            } else {
                return new LoadModuleError({
                    message: e.message,
                    errorName: e.name,
                    path,
                    code: "NO_SUCH_PATH",
                });
            }
        },
    });

/**
 * Import + basic validation of a user's virtual table module
 * code
 *
 * The contract is that the user exports a default function
 * from whichever file they specify that takes in the sqlite3Api object as arg0,
 * with the ModuleAux options object as arg1, which returns
 * an `sqlite3_module` struct instance.
 * @param path The path to the module
 * @returns The user's default function export with 2 args
 *
 * holy mother of pipes (will change this to a gen() call later i just got a little lost in the sauce)
 */
function importUserModule(path: string) {
    return dynamicImport(path)
        .pipe(
            Effect.andThen((mod) =>
                Effect.liftPredicate(
                    mod.default,
                    (defaultExport) => typeof defaultExport !== "undefined",
                    () =>
                        new LoadModuleError({
                            message: `sqliteow: no default export found`,
                            path,
                            code: "NO_DEFAULT_EXPORT",
                        }),
                ),
            ),
        )
        .pipe(
            Effect.andThen(
                Effect.liftPredicate(
                    (defaultExport): defaultExport is VirtualTableExtensionFn =>
                        typeof defaultExport === "function" &&
                        defaultExport.length > 0,
                    (mod) =>
                        new LoadModuleError({
                            message: `better-worker1: expected a function with 2 args as the default export but got ${typeof mod} with ${mod.length} args`,
                            path,
                            code: "TYPE_MISMATCH_DEFAULT_EXPORT",
                        }),
                ),
            ),
        );
}

/**
 * For getting a runtime virtual table URL
 * @param moduleURL The pathstring to the es module
 * @param aux Any helper data for the Virtual Table extension function
 * @returns the virtual table sqlite3_module
 * @throws {@link BetterModuleLoadError} | UnknownException
 */
export function wrapSqlite3Module(
    sqlite3: Sqlite3Static,
    moduleURL: string,
    aux?: ModuleAux,
): Effect.Effect<sqlite3_module, LoadModuleError | UnknownException> {
    return importUserModule(moduleURL).pipe(
        Effect.andThen((userFunction) =>
            Effect.tryPromise({
                try: () => userFunction(sqlite3, aux),
                catch: (e) => {
                    console.error(
                        `better-worker1: error loading user's virtual table module ${e}`,
                    );
                    return new LoadModuleError({
                        message: ``,
                        path: moduleURL,
                        code: "UNKNOWN",
                    });
                },
            }),
        ),
    );
}

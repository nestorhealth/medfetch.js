import type { Sqlite3, Sqlite3Module } from "@sqlite.org/sqlite-wasm";
import { Tag } from "effect/Context";
import { TaggedError } from "effect/Data";
import { andThen, type Effect, liftPredicate, provideService, tap, tryPromise } from "effect/Effect";
import { ModuleContext } from "~/sqlite-wasm/virtual-table.services";

/**
 * @internal
 */
export class Worker1Error extends TaggedError("sqlite-wasm/worker1")<{
    operation: "bootstrap" | "load-module";
    message?: string;
    errorName?: string;
}> {}

type BaseSqlite3InitModuleFunc =
    (typeof import("@sqlite.org/sqlite-wasm"))["default"];

/**
 * Default export type
 * @internal
 */
export type Sqlite3InitModuleFunc = (
    ...args: Parameters<BaseSqlite3InitModuleFunc>
) => Promise<Sqlite3>;

/**
 * Now make it a service
 * 
 * @internal
 */
export class Sqlite3InitModule extends Tag(
    "Sqlite3InitModule",
)<Sqlite3InitModule, Sqlite3InitModuleFunc>() {}

/**
 * Loads the sqlite3 wasm API via the default ESM module export
 * @param wasmLoader The default export function of @sqlite/sqlite-wasm
 */
function load(wasmLoader: Sqlite3InitModuleFunc) {
    return tryPromise({
        try: () =>
            wasmLoader({
                print: console.log,
                printErr: console.error,
            }),
        catch: (e) => {
            if (e instanceof Error) {
                return new Worker1Error({
                    operation: "bootstrap",
                    message: e.message,
                    errorName: e.name,
                });
            } else {
                return new Worker1Error({
                    operation: "bootstrap",
                    message: `Unknown error ${e} thrown while loading the wasm module`,
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
    andThen(load),
    tap((sqlite3) => sqlite3.initWorker1API()),
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
    init.pipe(provideService(Sqlite3InitModule, mod));

export interface VirtualTableUserConfig<AuxMap extends Record<string, any>> {
    /**
     * Any transferables sent from main thread that the
     * vtable module needs the worker1 thread to take ownership of.
     */
    transfer: readonly MessagePort[];

    /**
     * Any user defined aux
     */
    vars: AuxMap;
}

export interface UserContext<Variables extends Record<string, any>> extends Tag.Service<ModuleContext> {
    /**
     * Any user defined aux in js-land
     */
    aux: Variables;

    /**
     * Any transferables sent from main thread that the
     * vtable module needs the worker1 thread to take ownership of.
     */
    transfer: readonly MessagePort[];
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
export type VirtualTableExtensionFn<
    Vars extends Record<string, any> = Record<string, any>,
> = (
    sqlite3: Sqlite3,
    context: UserContext<Vars>
) => Promise<Sqlite3Module>;

const dynamicImport = (path: string) =>
    tryPromise({
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
                return new Worker1Error({
                    operation: "load-module",
                    message: `Unknown error occurred while loading dynamic import`,
                    errorName: "UNKNOWN",
                });
            } else {
                return new Worker1Error({
                    operation: "load-module",
                    message: `That path doesn't exist ${path}`,
                    errorName: "NO_SUCH_PATH",
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
            andThen((mod) =>
                liftPredicate(
                    mod.default,
                    (defaultExport) => typeof defaultExport !== "undefined",
                    () =>
                        new Worker1Error({
                            operation: "load-module",
                            message: `No default export found`,
                            errorName: "NO_DEFAULT_EXPORT",
                        }),
                ),
            ),
        )
        .pipe(
            andThen(
                liftPredicate(
                    (defaultExport): defaultExport is VirtualTableExtensionFn =>
                        typeof defaultExport === "function" &&
                        defaultExport.length > 0,
                    (mod) =>
                        new Worker1Error({
                            operation: "load-module",
                            message: `Expected a function with 2 args as the default export but got ${typeof mod} with ${mod.length} args`,
                            errorName: "TYPE_MISMATCH_DEFAULT_EXPORT",
                        }),
                ),
            ),
        );
}

/**
 * From a runtime virtual table URL and any user defined {@link aux}
 * data from the main thread request message, wrap the callback in a
 * {@link Sqlite3Module}.
 * @param moduleURL The pathstring to the es module
 * @param aux Any helper data for the Virtual Table extension function
 * @returns The JS virtual table wrapped as a {@link Sqlite3Module}
 */
export function wrapSqlite3Module(
    sqlite3: Sqlite3,
    moduleURL: string,
    aux: UserContext<any>,
): Effect<Sqlite3Module, Worker1Error> {
    return importUserModule(moduleURL).pipe(
        andThen((makeUserModule) =>
            tryPromise({
                try: () => makeUserModule(sqlite3, aux),
                catch: (e) =>
                    new Worker1Error({
                        operation: "load-module",
                        message: `Unknown error while wrapping user vtable module (${(makeUserModule.name, e)})`,
                        errorName: "UNKNOWN",
                    }),
            }),
        ),
    );
}

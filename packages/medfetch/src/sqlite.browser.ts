/**
 * For convenience
 */
import { isBrowser } from "./json.types";
import { Worker1PromiserDialect } from "~/dialects";
import type { SqlOnFhirDialect } from "~/sql.types";
import { kyselyDummy } from "~/sql";
import { promiserSyncV2 } from "~/sqlite-wasm/worker1.main";
import { ResourceType } from "~/json.types";
import SqliteWasmWorker from "./sqlite-wasm.thread?worker";

/**
 * Medfetch's default sqlite on FHIR client dialect
 * @param filename The filename to persist the database to, uses opfs by default but if you pass in ":memory:", then the opfs vfs option will be
 * @param baseURL The fhir data source, either the base URL of a FHIR API or a raw File Bundle
 * @param resources The resource types to include
 * @returns A plain {@link Worker1PromiserDialect} wrapped over a {@link SqlOnFhirDialect} for typescript users
 */
export function sqliteOnFhir<const Resources extends ResourceType[]>(
    filename: string,
    baseURL: string | File,
    scope: Resources,
    worker?: Worker
): SqlOnFhirDialect<Resources> {
    const SQLITE_WORKER = worker ?? new SqliteWasmWorker({
        name: "sqlite-wasm.thread"
    });

    if (!isBrowser()) {
        console.warn(
            `[medfetch/sqlite-wasm] > Called in non-browser environment, returning dummy...`,
        );
        return kyselyDummy("sqlite") as any as SqlOnFhirDialect<Resources>;
    }
    return new Worker1PromiserDialect(
        {
            type: "open",
            args: {
                vfs: "opfs",
                filename,
            },
            aux: {
                baseURL,
                scope,
            },
        },
        promiserSyncV2(SQLITE_WORKER),
    ) as SqlOnFhirDialect<Resources>;
}

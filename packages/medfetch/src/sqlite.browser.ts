/**
 * For convenience
 */
import { isBrowser } from "~/json";
import { Worker1PromiserDialect } from "~/dialects";
import type { SqlOnFhirDialect } from "~/sql.types";
import { kyselyDummy } from "~/sql";
import { promiserSyncV2 } from "~/sqlite-wasm/worker1.main";
import { ResourceType } from "~/json.types";

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
    scope: Resources
): SqlOnFhirDialect<Resources> {
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
                scope
            },
        },
        promiserSyncV2(
            new Worker(
                new URL(
                    import.meta.env.DEV
                        ? "./sqlite-wasm.worker.js"
                        : "./sqlite-wasm.worker.js",
                    import.meta.url,
                ),
                {
                    type: "module",
                    name: "sqlite-wasm.worker",
                },
            ),
        ),
    ) as SqlOnFhirDialect<Resources>;
}

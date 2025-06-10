import type { FhirResource } from "fhir/r4";
import { isBrowser } from "~/data";
import { type SqlOnFhirDialect, Worker1PromiserDialect } from "~/dialects";
import { kyselyDummy } from "~/sql";
import { promiserSyncV2 } from "~/sqlite-wasm/worker1.main";

/**
 * Medfetch's default sqlite on FHIR client dialect
 * @param filename The filename to persist the database to, uses opfs by default but if you pass in ":memory:", then the opfs vfs option will be
 * @param baseURL The fhir data source, either the base URL of a FHIR API or a raw File Bundle
 * @param resources The resource types to include
 * @returns A plain {@link Worker1PromiserDialect} wrapped over a {@link SqlOnFhirDialect} for typescript users
 */
export function sqliteWasmOnFhir<
    Resources extends [
        FhirResource["resourceType"],
        ...FhirResource["resourceType"][],
    ],
>(
    filename: string,
    baseURL: string | File,
    resources: Resources,
): SqlOnFhirDialect<Resources> {
    if (!isBrowser()) {
        console.warn(`[medfetch/sqlite-wasm] > Called in non-browser environment, returning dummy...`);
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
                resources,
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

import type { SqliteowRequest } from "sqliteow";

/**
 * Module loader convenience function
 *
 * example usage:
 * ```ts
 *
 * await message({
 *  type: "ow-load-module",
 *  args: medfetch("https://my-base-url.com")
 * });
 * ```
 *
 * @param baseUrl the fhir server base url
 * @returns the worker message args for the medfetch virtual table module
 */
export default function medfetch(baseUrl: string) {
    return {
        moduleURL: new URL(
            "/sqliteow/vtab/medfetch.vtab.mjs",
            self.location.origin,
        ).toString(),
        moduleName: "medfetch",
        loaderAux: [
            new URL(
                "/sqliteow/vtab/fetch.worker.mjs",
                self.location.origin,
            ).toString(),
        ],
        aux: new TextEncoder().encode(baseUrl),
    } satisfies Extract<SqliteowRequest, { type: "ow-load-module" }>["args"];
}

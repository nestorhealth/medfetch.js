import type { SqliteOwWorkerMessage } from "sqliteow";

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
    const moduleUrl = new URL("medfetch.vtab.js", import.meta.url).toString();
    return {
        moduleUrl,
        moduleName: "medfetch",
        aux: new TextEncoder().encode(baseUrl)
    } satisfies Extract<SqliteOwWorkerMessage, { type: "ow-load-module" }>["args"]
}

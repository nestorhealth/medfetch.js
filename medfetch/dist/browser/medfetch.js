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
export default function medfetch(baseUrl) {
    const moduleUrl = new URL("medfetch.vtab.js", import.meta.url).toString();
    return {
        moduleUrl,
        moduleName: "medfetch",
        loaderAux: [new URL("fetch.worker.js", import.meta.url).toString()],
        aux: new TextEncoder().encode(baseUrl)
    };
}

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
export default function medfetch(baseUrl: string): {
    moduleURL: string;
    moduleName: string;
    loaderAux: string[];
    aux: Uint8Array<ArrayBufferLike>;
};

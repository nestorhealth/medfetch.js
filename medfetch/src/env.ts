/**
 * @internal
 * @returns If global `process` var exists
 */
export function isServer(): boolean {
    return typeof process !== "undefined";
}

/**
 * @internal
 * @returns If global `window` var exists
 */
export function isBrowser(): boolean {
    return typeof window !== "undefined";
}

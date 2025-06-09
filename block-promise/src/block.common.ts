/**
 * Returns a plain 2-tuple {@link Array} "view" of a given SharedArrayBuffer
 * where bytes 0-7 are the signal bytes and bytes 8 - N are allocated for the
 * message data.
 *
 * @param sab A {@link SharedArrayBuffer}
 * @returns [ signalBytes as Int32Array, resultBuffer as Uint8Array ]
 */
export function viewSab(sab: SharedArrayBuffer): [Int32Array, Uint8Array] {
    return [new Int32Array(sab, 0, 2), new Uint8Array(sab, 8)];
}

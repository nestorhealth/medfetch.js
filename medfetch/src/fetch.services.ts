/**
 * "ctor" esque function for a blocking fetch call, meant to be called from
 * a worker thread that doesn't care about blocking
 * @param port The "write" port of the Fetch worker
 * @returns A synchronous fetch request function
 */
export function FetchSync(port: MessagePort) {
    const sab = new SharedArrayBuffer(4 + 4 + 3 * 1024 * 1024);
    return function request(...args: Parameters<typeof fetch>) {
        const signal = new Int32Array(sab, 0, 1);
        signal[0] = 0;
        port.postMessage({
            sharedSignal: sab,
            url: args[0],
            init: args[1],
            type: "request"
        });
        // sleep until signal != 0
        Atomics.wait(signal, 0, 0);

        // get payload
        const size = new DataView(sab, 4, 4).getUint32(0, true);
        const body = new Uint8Array(sab, 8, size);
        const serialized = new TextDecoder().decode(body.slice());
        return serialized;
    };
}

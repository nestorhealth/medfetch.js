import { Data } from "effect";

export type Fetch = Data.TaggedEnum<{
    readonly request: {
        readonly sab: SharedArrayBuffer;
        readonly id: number;
        readonly url: string;
        readonly init: RequestInit | undefined;
    };
    readonly readJson: {
        readonly sab: SharedArrayBuffer;
        readonly id: number;
    }
}>;

export const Fetch = Data.taggedEnum<Fetch>();

export class FetchSyncError extends Data.Error<{ 
    message?: string;
}> {};

class ResponseProxySync {
    #sab: SharedArrayBuffer;
    #port: MessagePort;
    #id: number;

    constructor(port: MessagePort, sab: SharedArrayBuffer, responseId: number) {
        this.#port = port;
        this.#sab = sab;
        this.#id = responseId;
    }

    get json() {
        const signal = new Int32Array(this.#sab, 0, 1);
        signal[0] = 0;
        const msg = Fetch.readJson({
            sab: this.#sab,
            id: this.#id
        });
        this.#port.postMessage(msg);
        Atomics.wait(signal, 0, 0);
        const result = Atomics.load(signal, 0);
        if (result < 0) {
            throw new FetchSyncError({ 
                message: `FetchSync: something went wrong with parsing the json response, response id was: ${this.#id}`
            });
        }
        const size = new DataView(this.#sab, 4, 4).getUint32(0, true);
        const body = new Uint8Array(this.#sab, 8, size);
        const serialized = new TextDecoder().decode(body.slice());
        return JSON.parse(serialized);
    }
}


/**
 * "ctor" esque function for a blocking fetch call, meant to be called from
 * a worker thread that doesn't care about blocking
 * @param port The "write" port of the Fetch worker
 * @returns A synchronous fetch request function
 */
export function FetchSync(port: MessagePort) {
    // 4B for size + 4B offset + 3 MB payload
    const sab = new SharedArrayBuffer(4 + 4 + 3 * 1024 * 1024);
    let nextId = 1;
    return function fetchSync(...args: Parameters<typeof fetch>) {
        const signal = new Int32Array(sab, 0, 1);
        signal[0] = 0;
        let url = args[0];
        if (typeof url !== "string") {
            url = url.toString();
        }
        const id = nextId++;
        const message = Fetch.request({
            sab,
            url,
            init: args[1],
            id
        });
        port.postMessage(message);
        // sleep until signal != 0
        Atomics.wait(signal, 0, 0);
        return new ResponseProxySync(port, sab, id);
    };
}

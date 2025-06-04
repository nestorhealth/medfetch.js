import { Tag } from "effect/Context";
import { type TaggedEnum, taggedEnum, TaggedError } from "effect/Data";

export type FetchMessage = TaggedEnum<{
    readonly request: {
        readonly sab: SharedArrayBuffer;
        readonly id: number;
        readonly url: string;
        readonly init: RequestInit | undefined;
    };
    readonly readJson: {
        readonly sab: SharedArrayBuffer;
        readonly id: number;
    };
    readonly startStream: {
        readonly sab: SharedArrayBuffer;
        readonly id: number;
    };
    readonly readChunk: {
        readonly sab: SharedArrayBuffer;
        readonly id: number;
    };
}>;

export const FetchMessage = taggedEnum<FetchMessage>();

class FetchSyncError extends TaggedError("medfetch/fetch")<{
    message?: string;
}> {}

export class ResponseProxySync {
    readonly #sab: SharedArrayBuffer;
    readonly #port: MessagePort;
    readonly #id: number;
    readonly status: number;

    constructor(
        port: MessagePort,
        sab: SharedArrayBuffer,
        responseId: number,
        statusCode: number,
    ) {
        this.#port = port;
        this.#sab = sab;
        this.#id = responseId;
        this.status = statusCode;
    }

    #signal() {
        const signal = new Int32Array(this.#sab, 0, 1);
        signal[0] = 0;
        return signal;
    }

    *#bodyIt() {
        while (true) {
            const signal = this.#signal();
            const msg = FetchMessage.readChunk({
                sab: this.#sab,
                id: this.#id,
            });
            this.#port.postMessage(msg);
            Atomics.wait(signal, 0, 0);
            const result = Atomics.load(signal, 0);
            if (result < 0) {
                throw new FetchSyncError({
                    message: `Stream chunk fetch error`,
                });
            }
            const size = new DataView(this.#sab, 4, 4).getUint32(0, true);
            if (size === 0) {
                return;
            }
            const body = new Uint8Array(this.#sab, 8, size);
            const chunk = new TextDecoder().decode(body.slice());
            yield chunk;
        }
    }

    get ok() {
        return this.status >= 200 && this.status < 300;
    }

    get json() {
        const signal = this.#signal();
        const msg = FetchMessage.readJson({
            sab: this.#sab,
            id: this.#id,
        });
        this.#port.postMessage(msg);
        Atomics.wait(signal, 0, 0);
        const result = Atomics.load(signal, 0);
        if (result < 0) {
            throw new FetchSyncError({
                message: `FetchSync: something went wrong with parsing the json response, response id was: ${this.#id}`,
            });
        }
        const size = new DataView(this.#sab, 4, 4).getUint32(0, true);
        const body = new Uint8Array(this.#sab, 8, size);
        const serialized = new TextDecoder().decode(body.slice());
        return JSON.parse(serialized);
    }

    get stream() {
        const signal = this.#signal();
        const msg = FetchMessage.startStream({
            sab: this.#sab,
            id: this.#id,
        });
        this.#port.postMessage(msg);
        Atomics.wait(signal, 0, 0);
        const result = Atomics.load(signal, 0);
        if (result < 0) {
            throw new FetchSyncError({
                message: `FetchSync: something went wrong with getting the Reader stream, response id was: ${this.#id}`,
            });
        }
        return this.#bodyIt();
    }
}

export class _FetchSync extends Tag("FetchSynchronous")<
    _FetchSync,
    (...args: Parameters<typeof fetch>) => ResponseProxySync
>() {
    static make(port: MessagePort): Tag.Service<_FetchSync> {
        // 4B for size + 4B offset + 3 MB payload
        const sab = new SharedArrayBuffer(4 + 4 + 3 * 1024 * 1024);
        let nextId = 1;
        return function fetchSync(...args: Parameters<typeof fetch>) {
            const signal = new Int32Array(sab, 0, 1);
            const status = new Int32Array(sab, 4, 1);
            signal[0] = 0;
            let url = args[0];
            if (typeof url !== "string") {
                url = url.toString();
            }
            const id = nextId++;
            const message = FetchMessage.request({
                sab,
                url,
                init: args[1],
                id,
            });
            port.postMessage(message);
            // sleep until signal != 0
            Atomics.wait(signal, 0, 0);
            const statusCode = status[0];
            return new ResponseProxySync(port, sab, id, statusCode);
        };
    }
}

type FetchSync = (...args: Parameters<typeof fetch>) => ResponseProxySync

export async function FetchSyncWorker(): Promise<FetchSync> {
    const port = await new Promise<MessagePort>((resolve, reject) => {
        const { port1, port2 } = new MessageChannel();
        const fetchWorker = new Worker(
            new URL("./fetch.worker", import.meta.url),
            {
                type: "module",
            },
        );
        const onMessage = (e: MessageEvent) => {
            if (
                e.data === "fetch-sync-ready" ||
                e.data?.type === "fetch-sync-ready"
            ) {
                port1.removeEventListener("message", onMessage);
                resolve(port1);
            } else {
                port1.removeEventListener("message", onMessage);
                reject(
                    new Error(`Unexpected message: ${JSON.stringify(e.data)}`),
                );
            }
        };
        port1.addEventListener("message", onMessage);
        port1.start();
        fetchWorker.postMessage(
            {
                type: "init",
            },
            [port2],
        );
    });
    const sab = new SharedArrayBuffer(4 + 4 + 3 * 1024 * 1024);
    let nextId = 1;
    return function fetchSync(...args: Parameters<typeof fetch>) {
        const signal = new Int32Array(sab, 0, 1);
        const status = new Int32Array(sab, 4, 1);
        signal[0] = 0;
        let url = args[0];
        if (typeof url !== "string") {
            url = url.toString();
        }
        const id = nextId++;
        const message = FetchMessage.request({
            sab,
            url,
            init: args[1],
            id,
        });
        port.postMessage(message);
        // sleep until signal != 0
        Atomics.wait(signal, 0, 0);
        const statusCode = status[0];
        return new ResponseProxySync(port, sab, id, statusCode);
    };
}

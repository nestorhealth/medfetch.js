import { isMainThread, parentPort } from "node:worker_threads";
import type { Block, MessageConfig } from "./block.types";
import { viewSab } from "./block.common";

export function block<Args extends any[], Result>(
    asyncFn: (...args: Args) => Promise<Result>,
    {
        encode = JSON.stringify,
        decode = JSON.parse,
        byteSize = 500_000,
    }: Partial<MessageConfig<Result>> = {},
): Block<Args, Result> {

    const sync = (...args: Args): Result => {
        const isNodeWorker =
            typeof process !== "undefined" &&
            process.versions?.node &&
            !isMainThread &&
            parentPort;

        if (!isNodeWorker) {
            return void 0 as Result;
        }

        const sab = new SharedArrayBuffer(8 + byteSize);
        const [signal, buffer] = viewSab(sab);
        signal[0] = 0;

        parentPort!.postMessage({ sab, args });
        Atomics.wait(signal, 0, 0);
        const rc = Atomics.load(signal, 0);
        if (rc) throw new Error("Deferred error");
        const len = signal[1];
        const text = new TextDecoder().decode(buffer.slice(0, len));
        return decode(text);
    };

    const handle = () => {
        parentPort!.on("message", async ({ sab, args }) => {
            const [signal, buffer] = viewSab(sab);
            let rc = 0;
            try {
                const result = await asyncFn(...args);
                const encoded = new TextEncoder().encode(encode(result));
                if (encoded.length > buffer.length)
                    throw new Error("Too large");
                buffer.set(encoded);
                signal[1] = encoded.length;
            } catch {
                rc = 1;
            } finally {
                Atomics.store(signal, 0, rc);
                Atomics.notify(signal, 0);
            }
        });
    };

    return [sync, handle];
}

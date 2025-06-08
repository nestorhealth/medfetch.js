/**
 * The signal and result buffer from a given {@link sab}
 * @param sab A shared array buffer with bytes [0-7] for signal number and bytes [8-PAYLOAD_SIZE] for the data
 * @returns A tuple view of the buffers
 */
function decodeSab(
    sab: SharedArrayBuffer,
): [Int32Array, Uint8Array] {
    return [new Int32Array(sab, 0, 2), new Uint8Array(sab, 8)];
}

interface BlockPromiseConfig<Result> {
    encode: (result: Result) => string;
    decode: (resultText: string) => Result;
    byteSize: number;
}

/**
 * Block 
 * @param asyncFn 
 * @param encode 
 * @param decode 
 * @returns 
 */
export default function block<Args extends any[], Result>(
    asyncFn: (...args: Args) => Promise<Result>,
    {
        encode,
        decode,
        byteSize
    }: BlockPromiseConfig<Result> = {
        encode(result) {
            return JSON.stringify(result);
        },
        decode(resultText) {
            return JSON.parse(resultText);
        },
        byteSize: 500000
    }
): [(...args: Args) => Result, (worker: Worker) => Promise<void>] {
    async function handle(worker: Worker): Promise<void> {
        worker.onmessage = async (
            e: MessageEvent<{ sab: SharedArrayBuffer; args: Args }>,
        ) => {
            const args = e.data.args ?? [];
            if (e.data.sab) {
                const [signal, buffer] = decodeSab(e.data.sab);
                let rc = 0;
                try {
                    const result = await asyncFn(...args);
                    const serialized = encode(result);
                    const encoded = new TextEncoder().encode(serialized);
                    if (encoded.length > buffer.length) {
                        throw new Error(
                            `Encoded buffer too large: ${encoded.length} > ${buffer.length}`,
                        );
                    }
                    buffer.set(encoded);
                    signal[1] = encoded.length;
                } catch (err) {
                    console.error("Deferred error:", err);
                    rc = 1;
                } finally {
                    Atomics.store(signal, 0, rc);
                    Atomics.notify(signal, 0);
                }
            }
        };
    }

    function sync(...args: Args): Result {
        if (
            typeof WorkerGlobalScope !== "undefined" &&
            self instanceof WorkerGlobalScope
        ) {
            const sab = new SharedArrayBuffer(8 + byteSize);
            const [signal] = decodeSab(sab);
            signal[0] = 0;
            self.postMessage({ sab, args });
            Atomics.wait(signal, 0, 0);
            const rc = Atomics.load(signal, 0);
            if (rc) {
                throw new Error(`Error in deferred promise`);
            }
            const len = signal[1];
            const buffer = new Uint8Array(sab, 8, len);
            const text = new TextDecoder().decode(buffer.slice());
            return decode(text);
        } else {
            return void 0 as any;
        }
    }

    return [sync, handle];
}

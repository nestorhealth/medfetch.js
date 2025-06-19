interface WorkerNameMap {
    readonly asyncWorker: string | null;
    readonly syncWorker: string;
}

/**
 * Pass in the worker or a callback that returns the worker of either the
 * async handler or the sync handler, depending on who is in charge of pinging
 * that handler
 * 
 * Case 1. Sync handler is Pinger
 * Then the sync handler thread needs to (ironically) `await` the ping to the async handler thread because
 * it needs to pass in a {@link MessagePort}
 * 
 * Case 2. Async handler is Pinger
 * Then the 
 */
export type Ping = (
    worker: Worker | ((names: WorkerNameMap) => Worker),
) => Promise<Worker>;
    
/**
 * The 2-tuple returned by [block()](./block.browser.ts)
 *
 * @template Args the arguments the original function takes
 * @template Result the awaited return type of the original function
 */
export type Block<Args extends any[], Result> = readonly [
    (...args: Args) => Result,
    Ping,
];

/**
 * Set the encoder and decoder pairs along with
 * allocated byte size of the buffer in the message handlers.
 *
 * @template Result The awaited return type of the deferred async function
 */
export interface MessageConfig<Result> {
    /**
     * How to serialize the return type into a plaintext string? Defaults to
     * {@link JSON.stringify}
     * @param result The awaited return type
     * @returns Its string serialization.
     */
    encode: (result: Result) => string;

    /**
     * How to deserialize the text value back into an object? Defaults to
     * {@link JSON.parse}
     * @param text The plaintext of the value
     * @returns The result parsed
     */
    decode: (text: string) => Result;

    /**
     * How many bytes to allocate for the underlying {@link SharedArrayBuffer}
     * for the payload. 8 bytes at the start are always allocated for the
     * signal value, so total byte size will be this 8 + {@link byteSize}:
     *
     * ```ts
     * const sab = new SharedArrayBuffer(8 + byteSize)
     * ```
     *
     * Defaults to 500,000
     */
    byteSize: number;
}

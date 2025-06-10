/**
 * The message handler the async handler thread needs to call to carry out the deferred promise.
 * 
 * It can also be called by the deferrer worker, but then it needs to await
 * this situation is probably rare
 */
export type WorkerHandle = (
    worker: Worker | ((name: string) => Worker),
) => Promise<Worker>;
    
/**
 * The 3-tuple returned by [block()](./block.browser.ts)
 *
 * @template Args the arguments the original function takes
 * @template Result the awaited return type of the original function
 */
export type Block<Args extends any[], Result> = [
    /* The "sync" blocking version signature */
    (...args: Args) => Result,
        
    WorkerHandle,

    /* The onMessage handler for the child */
    (e: MessageEvent) => void
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

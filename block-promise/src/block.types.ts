/**
 * The two tuple returned by [block()](./block.browser.ts)
 * 
 * @template Args the arguments the original function takes
 * @template Result the awaited return type of the original function
 */
export type Block<Args extends any[], Result> = [
    /* The "sync" blocking version signature */
    (...args: Args) => Result,
        
    /* The message handler the async handler thread needs to call to carry out the deferred promise */
    (worker: Worker) => void,
];

/**
 * Set the encoder and decoder pairs along with
 * allocated byte size of the buffer in the message handlers.
 * 
 * @template Result The awaited return type of the deferred async function
 */
export interface MessageConfig<Result> {
    /**
     * How to serialize the return type into a plaintext string?
     * @param result The awaited return type
     * @returns Its string serialization.
     */
    encode: (result: Result) => string;
    
    /**
     * How to deserialize the text value back into an object?
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
     */
    byteSize: number;
}
import type { BetterWorker1MessageType } from "./types.js";
export declare class Counter {
    #private;
    constructor();
    /**
     * Increment the counter and get back the message id
     *
     * @param msgType The message type
     * @returns How many times msgType has been called including the ++
     */
    increment(msgType: BetterWorker1MessageType): string;
    /**
     * Wrap reading from object directly COUNT_MAP[msgType]
     * @param msgType The message type
     * @returns How many times a request of type msgType has been called by any given promiser
     */
    messageId(msgType: BetterWorker1MessageType): string;
    get(messageId: string): StructuredSerializeOptions | undefined;
    set(messageId: string, transfer: StructuredSerializeOptions): Map<string, StructuredSerializeOptions>;
}

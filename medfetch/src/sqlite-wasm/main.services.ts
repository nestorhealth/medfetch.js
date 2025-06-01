import { Tag } from "effect/Context";
import type { BetterWorker1MessageType, MessageTypeObjMap } from "./types.js";
import { MESSAGE_TYPES } from "./types.js";

export class WebWorker extends Tag("WebWorker")<WebWorker, Worker>() {}

export class Counter {
    #transfers: Map<string, StructuredSerializeOptions>;
    #counts: MessageTypeObjMap<number>;

    #id(messageType: BetterWorker1MessageType, count: number) {
        return `${messageType}#${count}`;
    }

    constructor() {
        (this.#transfers = new Map<string, StructuredSerializeOptions>()),
            (this.#counts = Object.fromEntries(
                MESSAGE_TYPES.map((type) => [type, 0] as const),
            ) as MessageTypeObjMap<number>);
    }

    /**
     * Increment the counter and get back the message id
     *
     * @param msgType The message type
     * @returns How many times msgType has been called including the ++
     */
    increment(msgType: BetterWorker1MessageType) {
        const count = (this.#counts[msgType] =
            (this.#counts[msgType] || 0) + 1);
        return this.#id(msgType, count);
    }

    /**
     * Wrap reading from object directly COUNT_MAP[msgType]
     * @param msgType The message type
     * @returns How many times a request of type msgType has been called by any given promiser
     */
    messageId(msgType: BetterWorker1MessageType) {
        return this.#id(msgType, this.#counts[msgType]);
    }

    get(messageId: string) {
        return this.#transfers.get(messageId);
    }

    set(messageId: string, transfer: StructuredSerializeOptions) {
        return this.#transfers.set(messageId, transfer);
    }
}

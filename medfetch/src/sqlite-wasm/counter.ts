type CountMap<Tag extends string> = {
    [Key in Tag]: number;
};

/**
 * @internal
 */
export class TransferCounter<Tag extends string> {
    #transfers: Map<string, StructuredSerializeOptions>;
    #counts: CountMap<Tag>;
    #key: (tag: Tag, count: number) => string;

    constructor(
        tags: Tag[],
        keyFn: (tag: Tag, count: number) => string = (tag, count) =>
            `${tag}#${count}`,
    ) {
        this.#transfers = new Map();
        this.#counts = Object.fromEntries(
            tags.map((type) => [type, 0] as const),
        ) as CountMap<Tag>;
        this.#key = keyFn;
    }

    /**
     * Increment the counter and get back the message id
     *
     * @param tag The message type
     * @returns How many times msgType has been called including the ++
     */
    increment(tag: Tag) {
        const count = (this.#counts[tag] = (this.#counts[tag] || 0) + 1);
        return this.#key(tag, count);
    }

    /**
     * Wrap reading from object directly COUNT_MAP[msgType]
     * @param tag tag key
     * @returns How many times a request of type key has been called by any given promiser
     */
    current(tag: Tag): number {
        return this.#counts[tag];
    }
    
    tagKey(msgType: Tag) {
        return this.#key(msgType, this.#counts[msgType]);
    }

    get(messageId: string) {
        return this.#transfers.get(messageId);
    }

    set(messageId: string, transfer: StructuredSerializeOptions) {
        return this.#transfers.set(messageId, transfer);
    }
}

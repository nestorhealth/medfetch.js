type CountMap<Tag extends string> = {
    [Key in Tag]: number;
};

export class Counter {
    #count: number;
    constructor() {
        this.#count = 0;
    }
    
    /**
     * Increment / set the counter
     * @param number What value to set count to. Defaults to incrementing
     * @returns The last count value
     */
    set(number?: number): number {
        let oldCount = this.#count;
        this.#count = number ?? oldCount + 1;
        return oldCount;
    }
    
    get count() {
        return this.#count;
    }
}

/**
 * Generic class for counting up
 */
export class KeyCounter<Key extends string> extends Map<Key, number> {
    constructor(keys?: Iterable<Key>) {
        if (!keys) {
            super();
        } else {
            const entries: [Key, number][] = [];
            for (const key of keys) {
                entries.push([key, 0]);
            }
            super(entries);
        }
    }

    /**
     * Increment the key by 1
     * @override {@link Map.prototype.set}
     * @param key The key to increment
     */
    override set(key: Key): this {
        const count = super.get(key) ?? 0;
        return super.set(key, count + 1);
    }
    
    /**
     * Override to get back a defined value no matter what.
     * Default to 0.
     * @param key The key you want the count of.
     * @returns Its current count
     */
    override get(key: Key): number {
        return super.get(key) ?? 0;
    }
}

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

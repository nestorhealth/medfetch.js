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
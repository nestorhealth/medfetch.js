import clarinet from "clarinet";

/**
 * Utility type that turns every optional field as non-optional
 * and every nullable field (not very applicable to FHIR to be fair
 * but the distinction is noted here) as non-nullable.
 *
 * @template Obj The object to get the "clean"-ed type of
 * @template IgnoreKeys Key patterns to ignore, if any. Defaults to `never`
 *
 * @example
 * ```ts
 * type LinkItem = Pathify<Bundle>["link"];
 * type LinkNoExtensions = Pathify<Bundle, `_${string}`>["link"];
 * ```
 */
export type Pathify<
    Obj,
    IgnoreKeys extends PropertyKey = never,
> = Obj extends (infer U)[]
    ? Pathify<U, IgnoreKeys>
    : Obj extends object
      ? {
            [K in keyof Obj as K extends IgnoreKeys ? never : K]-?: Pathify<
                NonNullable<Obj[K]>,
                IgnoreKeys
            >;
        }
      : NonNullable<Obj>;

/**
 * Unwrapped return type of calling the parser returned by {@link kdv()}
 * @template Value The expected type of value at key `k`. This is *NOT* a runtime type:
 * you must validate the payload yourself if you're unsure about type at key `k`.
 */
export interface KdvParseResult<Value> {
    /**
     * A *copy* of the first element of the value stack from the provided key (so the 'top' of the stack).
     * If stack head is a container (array / object) and has a child pointer that points to an incomplete
     * child (so hd.next / stack[1], same thing), then that child is pruned.
     */
    readonly hd: Value;

    /**
     * The pruned incomplete child of {@link hd} if it exists. Otherwise null.
     */
    readonly tl: Value[keyof Value] | null;
}

/**
 * The key-depth-value {@link clarinet} parser returned by {@link kdv}.
 * @template Value The expected type of the value from the key provided to {@link kdv} ctor.
 * @param chunk The next available chunk of the Bundle to send to {@link clarinet.CParser.write}
 * @returns Some {@link KdvParseResult} if it exists. None otherwise.
 *
 */
export type KdvParseFn<Value> = (chunk: string) => KdvParseResult<Value> | null;

/**
 * Returns a clarinet "key-depth-value" parser that searches for
 * a JSON key `k` at depth `d`, 0 indexed (so root is depth 0), and
 * returns value `v` indexed by `k` at that depth `d`.
 *
 * This JSON "parses" the value at that depth
 * @param k The key value
 * @param d A *positive* integer depth value >= 1 to extract the key value from (this treats root as index 0)
 * @returns Some value if it exists, None otherwise.
 */
export default function kdv<Value = unknown>(
    k: string,
    d: number,
): KdvParseFn<Value> {
    const parser = clarinet.parser();

    let currentKey = "";
    let depth = 0;

    let v: Value | null = null;
    let capturing = false;

    let stack: any[] = [];
    const peek = () => stack[stack.length - 1];
    const empty = () => stack.length === 0;

    parser.onkey = (key) => {
        if (key === k && depth === d) {
            capturing = true;
        }
        currentKey = key;
    };

    parser.onopenobject = (firstKey) => {
        depth++;

        // Manually apply the onkey logic
        if (capturing) {
            // e.g. nested empty object: {}
            if (empty()) {
                stack.push({});
            } else {
                const obj = {};
                if (Array.isArray(peek())) {
                    peek().push(obj);
                } else {
                    peek()[currentKey] = obj;
                }
                stack.push(obj);
            }
        }

        // SPECIAL CASE -- first key will NOT fire off onkey so we need to set the capture flag on a kd match in 'onopenobject' as well!! 
        if (firstKey === k && depth === d) {
            capturing = true;
        } 
        currentKey = firstKey;
    };

    parser.onopenarray = () => {
        if (capturing) {
            const arr: any[] = [];
            if (empty()) {
                stack.push([]);
            } else {
                if (Array.isArray(peek())) {
                    peek().push(arr);
                } else {
                    peek()[currentKey] = arr;
                }
                stack.push(arr);
            }
        }
        depth++;
    };

    parser.onvalue = (value) => {
        if (capturing) {
            if (stack.length > 0) {
                if (Array.isArray(peek())) {
                    peek().push(value);
                } else {
                    peek()[currentKey] = value;
                }
            } else {
                v = value as Value;
                capturing = false;
            }
        } else if (currentKey === k && depth === d) {
            v = value as Value;
        }
    };

    parser.oncloseobject = () => {
        depth--;
        if (capturing) {
            const top = stack.pop();
            if (depth === d) {
                capturing = false;
                stack = [];
                v = top;
            }
        }
    };

    parser.onclosearray = () => {
        depth--;
        if (capturing) {
            const top = stack.pop();
            if (depth === d) {
                capturing = false;
                stack = [];
                v = top;
            }
        }
    };

    return (chunk: string): KdvParseResult<Value> | null => {
        // fire off callbacks
        parser.write(chunk);
        // then check v's state
        if (v) {
            return {
                hd: v,
                tl: null,
            };
        } else if (stack.length > 0) {
            const hd = structuredClone(stack[0]);
            if (Array.isArray(hd)) {
                const popped = hd.pop();
                return {
                    hd: hd as Value,
                    tl: popped as any,
                };
            } else {
                const keys = Object.keys(hd);
                const last = keys[keys.length - 1];
                const lastChild = hd[last];
                delete hd[last];
                return {
                    hd: hd as Value,
                    tl: lastChild as any,
                };
            }
        } else {
            return null;
        }
    };
}

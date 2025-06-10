import clarinet from "clarinet";
import type { KdvParseFn, KdvParseFnMake, KdvParseResult } from "~/data.types";

/**
 * Returns a clarinet parser that searches for a JSON key `k` at depth `d` 0
 * indexed (so root is depth 0), and returns value `v` indexed by `k`.
 * @param k The key
 * @param d The depth (first key is depth 1)
 * @returns Some value if it exists, None otherwise.
 */
export const kdvParser: KdvParseFnMake = <Value = unknown>(
    k: string,
    d: number,
): KdvParseFn<Value> => {
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

    parser.onopenobject = (key) => {
        if (depth + 1 === d && key === k) {
            capturing = true;
            stack.push({});
        } else if (capturing) {
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
        depth++;
        currentKey = key;
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
        parser.write(chunk);
        if (!!v) {
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
};

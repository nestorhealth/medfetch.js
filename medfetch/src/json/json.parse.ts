import clarinet from "clarinet";
import type { Extension, FhirResource } from "fhir/r5";

/**
 * Utility type that turns every optional field as non-optional
 * and every nullable field (not very applicable to FHIR to be fair
 * but the distinction is noted here) as non-nullable.
 *
 * @template Obj The object to "clean"
 */
type Clean<Obj> = Obj extends (infer U)[]
    ? Clean<U> // unwrap arrays recursively
    : Obj extends object
      ? { [K in keyof Obj]-?: Clean<NonNullable<Obj[K]>> } // recursively clean nested fields
      : NonNullable<Obj>;

/**
 * Lookup {@link FhirResource} for the given {@link FhirResource.resourceType} value(s)
 *
 * @template ResourceType Any string literal from {@link FhirResource.resourceType}
 *
 * @example
 * ```ts
 * type PatientObject = ResourceByType<"Patient">;
 * ```
 */
export type ResourceFromType<
    Resource extends { resourceType: string },
    RT extends Resource["resourceType"],
> = Extract<Resource, { resourceType: RT }>;

/**
 * From the {@link FhirResource.resourceType} typename literal, get back
 * the "cleaned" child types so that every child indexed doesn't retain
 * their optional property nor any `| null` property.
 *
 * @template ResourceType The {@link FhirResource.resourceType} value to index into
 *
 * @example
 * ```ts
 * type AddressFromPatient = PathValue<"Patient">["address"]
 * ```
 */
export type PathValue<
    Resources extends { resourceType: string },
    ResourceType extends FhirResource["resourceType"],
> = Clean<ResourceFromType<Resources, ResourceType>>;

/**
 * The FHIR primitive type names and the only FHIR types I'm willing to write out statically at this point (lol)
 */
export type PrimitiveKey =
    | "base64Binary"
    | "boolean"
    | "canonical"
    | "code"
    | "date"
    | "dateTime"
    | "decimal"
    | "id"
    | "instant"
    | "integer"
    | "oid"
    | "positiveInt"
    | "string"
    | "time"
    | "unsignedInt"
    | "uri"
    | "url"
    | "uuid";

/**
 * To strip out garbage fields
 */
type KeyFilter<K extends string> =
    | `value${Capitalize<K>}`
    | `_value${Capitalize<K>}`
    | `_${K}`
    | "extension";

type ValueKeyType<K extends string> = K extends `value${infer T}` ? T : never;

/**
 * Key / typenames for complex struct elements
 */
export type StructKey = ValueKeyType<
    Exclude<keyof Extension, PrimitiveKey | KeyFilter<PrimitiveKey>>
>;

/**
 * Fhir datatypename union
 */
export type FhirDataType = PrimitiveKey | StructKey;

/**
 * Unwrapped return type of calling the parser returned by {@link kdvParser()}
 * @template Value The expected type of value at key `k`. This is *NOT* a runtime type:
 * you must validate the payload yourself if you're unsure about type at key `k`.
 */
export interface KdvParseResult<Value> {
    /**
     * A *copy* of the first element of the value stack from the provided key (so the 'top' of the stack).
     * If stack head is a container (array / object) and has a child pointer that points to an incomplete
     * child (so hd.next / stack[1], same thing), then that child is pruned.
     */
    hd: Value;

    /**
     * The pruned incomplete child of {@link hd} if it exists. Otherwise null.
     */
    tl: Value[keyof Value] | null;
}

/**
 * The key-depth-value {@link clarinet} parser returned by {@link kdvParser}.
 * @template Value The expected type of the value from the key provided to {@link kdvParser} ctor.
 * @param chunk The next available chunk of the Bundle to send to {@link clarinet.CParser.write}
 * @returns Some {@link KdvParseResult} if it exists. None otherwise.
 *
 */
export type KdvParseFn<Value> = (chunk: string) => KdvParseResult<Value> | null;

/**
 * Type signature for a function that accepts a {@link key} and
 *
 * @template Value The expected object type that the returned Record
 * @param key The key to search for
 * @param depth The depth to find it at (`0` indexed, meaning the JSON root is depth `0`)
 * @returns A {@link KdvParseFn} for the provided key-depth pair
 */
export type KdvParseFnMake = <Value>(
    key: string,
    depth: number,
) => KdvParseFn<Value>;

export function fromNullableOrThrow<T extends readonly unknown[]>(
    ...args: T
): { [K in keyof T]: NonNullable<T[K]> } {
    for (let i = 0; i < args.length; i++) {
        if (args[i] == null) {
            throw new Error(`unexpected nullable value at index ${i}`);
        }
    }
    return args as { [K in keyof T]: NonNullable<T[K]> };
}

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

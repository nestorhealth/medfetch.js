import type { Extension, FhirResource } from "fhir/r5";
import type { kdvParser } from "./json.parse";

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
export type ResourceFromType<RT extends ResourceType> = Extract<
    FhirResource,
    { resourceType: RT }
>;

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
export type PathValue<ResourceType extends FhirResource["resourceType"]> =
    Clean<ResourceFromType<ResourceType>>;

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
 * Union of all Resource names in the base specifications
 */
export type ResourceType = FhirResource["resourceType"];

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

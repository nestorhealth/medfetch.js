import { Option, Schema } from "effect";
export declare const Key: Schema.Literal<["base64Binary", "boolean", "canonical", "code", "date", "dateTime", "decimal", "id", "instant", "integer", "oid", "string", "positiveInt", "time", "unsignedInt", "uri", "url", "uuid"]>;
export type Key = typeof Key.Type;
export type ValueKey<TKey extends Key = Key> = `value${Capitalize<TKey>}`;
/**
 * For any given primitive literal, call it str...
 * createValueKey(str) = `value${String.capitalize(str)}`
 * @param t - the key name that is capitalized inside the strin
 * @returns the value key
 */
export declare const createValueKey: <TValueTypeName extends Key>(t: TValueTypeName) => ValueKey<TValueTypeName>;
/**
 * Static 'readonly' list of each `value[x]`
 * key possible with a Primitive Key (typename)
 */
export declare const valueKeys: readonly ValueKey<Key>[];
export declare const isValueKey: (u: unknown) => u is ValueKey<Key>;
/**
 * Typesafe `value[x]` key/property name getter that only cares about the object keys.
 *
 * **Allows for multiple value[x] keys to be present in the object**.
 *
 * **If that is the case, it extracts just the first since multivalued key objects have no meaning.**
 *
 * Example:
 *
 * ```ts
 * const normal = { valueBoolean: false };
 * const valueKey = getValueKey(normal); // this is the literal string 'valueBoolean'
 *
 * const multivalued = { valueBoolean: false, valueString: "lol" }
 * const valueKey = getValueKey(multivalued);
 * ```
 *
 * @param keyedStruct the primitively valued keyed struct to get the key from
 * @returns Option.Some(`value[x]`) value key string when t[value[x]] <> undefined && t[value[x]] has the correct FHIR Type
 */
export declare function getValueKey<TValuedStruct extends {
    [valueKey in ValueKey<Key>]?: any;
}>(t: TValuedStruct): Option.Option<ValueKey<Key>>;
export declare function fromValueKey<TKey extends Key>(valueKey: ValueKey<TKey>): TKey;
export declare const base64Binary: typeof Schema.String;
export declare const boolean: typeof Schema.Boolean;
export declare const canonical: typeof Schema.String;
export declare const code: typeof Schema.String;
export declare const date: typeof Schema.String;
export declare const dateTime: typeof Schema.String;
export declare const decimal: typeof Schema.Number;
export declare const id: typeof Schema.String;
export declare const instant: typeof Schema.String;
export declare const integer: typeof Schema.Int;
export declare const oid: typeof Schema.String;
export declare const string: typeof Schema.String;
export declare const positiveInt: Schema.filter<typeof Schema.Positive>;
export declare const time: typeof Schema.String;
export declare const unsignedInt: Schema.refine<number, typeof Schema.NonNegative>;
export declare const uri: typeof Schema.String;
export declare const url: typeof Schema.String;
export declare const uuid: typeof Schema.String;
export declare const get: <TKey extends Key>(key: TKey) => {
    valueKey: `value${Capitalize<TKey>}`;
    schema: {
        base64Binary: typeof Schema.String;
        boolean: typeof Schema.Boolean;
        canonical: typeof Schema.String;
        code: typeof Schema.String;
        date: typeof Schema.String;
        dateTime: typeof Schema.String;
        decimal: typeof Schema.Number;
        id: typeof Schema.String;
        instant: typeof Schema.String;
        integer: typeof Schema.Int;
        oid: typeof Schema.String;
        string: typeof Schema.String;
        positiveInt: Schema.filter<typeof Schema.Positive>;
        time: typeof Schema.String;
        unsignedInt: Schema.refine<number, typeof Schema.NonNegative>;
        uri: typeof Schema.String;
        url: typeof Schema.String;
        uuid: typeof Schema.String;
    }[TKey];
};

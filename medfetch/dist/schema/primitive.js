import { Array, pipe, String, Schema } from "effect";
export const Key = Schema.Literal("base64Binary", "boolean", "canonical", "code", "date", "dateTime", "decimal", "id", "instant", "integer", "oid", "string", "positiveInt", "time", "unsignedInt", "uri", "url", "uuid");
const Capitalized = Schema.Literal(...Key.literals.map((key) => String.capitalize(key)));
const ValueKey = Schema.TemplateLiteral(Schema.Literal("value"), Capitalized);
/**
 * For any given primitive literal, call it str...
 * createValueKey(str) = `value${String.capitalize(str)}`
 * @param t - the key name that is capitalized inside the strin
 * @returns the value key
 */
export const createValueKey = (t) => `value${String.capitalize(t)}`;
/**
 * Static 'readonly' list of each `value[x]`
 * key possible with a Primitive Key (typename)
 */
export const valueKeys = Key.literals.map(createValueKey);
export const isValueKey = (u) => typeof u === "string" && valueKeys.includes(u);
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
export function getValueKey(t) {
    return pipe(t, Object.keys, Array.findFirst((key) => key.startsWith("value")));
}
export function fromValueKey(valueKey) {
    return pipe(valueKey, String.replace("value", ""), String.uncapitalize);
}
export const base64Binary = Schema.String;
export const boolean = Schema.Boolean;
export const canonical = Schema.String;
export const code = Schema.String;
export const date = Schema.String;
export const dateTime = Schema.String;
export const decimal = Schema.Number;
export const id = Schema.String;
export const instant = Schema.String;
export const integer = Schema.Int;
export const oid = Schema.String;
export const string = Schema.String;
export const positiveInt = Schema.Positive.pipe(Schema.int());
export const time = Schema.String;
export const unsignedInt = Schema.NonNegativeInt;
export const uri = Schema.String;
export const url = Schema.String;
export const uuid = Schema.String;
const smap = {
    base64Binary,
    boolean,
    canonical,
    code,
    date,
    dateTime,
    decimal,
    id,
    instant,
    integer,
    oid,
    string,
    positiveInt,
    time,
    unsignedInt,
    uri,
    url,
    uuid,
};
export const get = (key) => ({
    valueKey: createValueKey(key),
    schema: smap[key]
});

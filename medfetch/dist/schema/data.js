import { Schema, Data as D } from "effect";
import * as Primitive from "./primitive";
import { ow } from "./data.element";
export const Tag = Schema.Struct({
    name: Schema.String,
    value: Schema.String,
});
const _ColumnPath = Schema.Struct({
    path: Schema.String,
    name: Schema.String,
    description: ow(Schema.String, { exact: true }),
    collection: ow(Schema.Boolean, { exact: true, default: () => false }),
    type: ow(Schema.String, { exact: true }),
    tags: ow(Schema.Array(Tag), { exact: true, default: () => [] }),
});
;
;
/**
 * Defaults on the following nullable fields:
 * ```ts
 * {
 *   [collection] := false, // from reference implementation tests
 *   [tags] := []
 * }
 * ```
 */
export const ColumnPath = _ColumnPath;
export const Where = Schema.Struct({
    path: Schema.String,
    description: ow(Schema.String, { exact: true }),
});
const _Select = Schema.Struct({
    column: ow(Schema.Array(ColumnPath), {
        exact: true,
    }),
    select: ow(Schema.Array(Schema.suspend(() => _Select)), { exact: true }),
    forEach: ow(Schema.String, { exact: true }),
    forEachOrNull: ow(Schema.String, { exact: true }),
    unionAll: ow(Schema.Array(Schema.suspend(() => _Select)), { exact: true }),
});
;
export const Select = _Select;
import { ContactDetail, Identifier, Meta, UsageContext } from "./data.element";
export { ContactDetail, Identifier, Meta, UsageContext } from "./data.element";
const _Constant = Schema.Struct({
    name: Schema.String,
    valueBase64Binary: ow(Primitive.base64Binary, { exact: true }),
    valueBoolean: ow(Primitive.boolean, { exact: true }),
    valueCanonical: ow(Primitive.canonical, { exact: true }),
    valueCode: ow(Primitive.code, { exact: true }),
    valueDate: ow(Primitive.date, { exact: true }),
    valueDateTime: ow(Primitive.dateTime, { exact: true }),
    valueDecimal: ow(Primitive.decimal, { exact: true }),
    valueId: ow(Primitive.id, { exact: true }),
    valueInstant: ow(Primitive.instant, { exact: true }),
    valueInteger: ow(Primitive.integer, { exact: true }),
    valueOid: ow(Primitive.oid, { exact: true }),
    valuePositiveInt: ow(Primitive.positiveInt, { exact: true }),
    valueString: ow(Primitive.string, { exact: true }),
    valueTime: ow(Primitive.time, { exact: true }),
    valueUnsignedInt: ow(Primitive.unsignedInt, { exact: true }),
    valueUri: ow(Primitive.uri, { exact: true }),
    valueUrl: ow(Primitive.url, { exact: true }),
    valueUuid: ow(Primitive.uuid, { exact: true }),
});
;
export const Constant = _Constant;
import { ResourceType, FhirVersion } from "./literal";
const _ViewDefinition = Schema.Struct({
    status: Schema.Literal("draft", "active", "retired", "unknown"),
    url: ow(Schema.String, { exact: true }),
    identifier: ow(Schema.Array(Identifier), { exact: true }),
    name: ow(Schema.String, { exact: true }),
    title: ow(Schema.String, { exact: true }),
    meta: ow(Meta, { exact: true }),
    experimental: ow(Schema.Boolean, { exact: true }),
    publisher: ow(Schema.String, { exact: true }),
    contact: ow(Schema.Array(ContactDetail), { exact: true }),
    description: ow(Schema.String, { exact: true }),
    useContext: ow(UsageContext, { exact: true }),
    copyright: ow(Schema.String, { exact: true }),
    resource: ResourceType,
    fhirVersion: ow(FhirVersion, { exact: true }),
    constant: ow(Schema.Array(_Constant), {
        exact: true,
    }),
    where: ow(Schema.Array(Where), { exact: true }),
    select: Schema.NonEmptyArray(Select),
});
;
;
export const ViewDefinition = _ViewDefinition;
/**
 * Constructor case function to create a  'native' `View Definition`
 *
 * Idea is that the output is portable with other sql-on-fhir
 * implementations.
 *
 * @param args the base view definition [fields](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html)
 * @returns the portable ViewDefinition
 */
export const make = D.case();
export const parseSync = Schema.decodeUnknownSync(ViewDefinition);
/**
 * 1st pass of decoding a `FHIRViewDefinition`
 * (the [schema](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html) defined from the specs)
 * into an object where the `ViewDefinition.select` fields are filled with defaults as needed for
 * the View Runner.
 *
 * @param i - The FHIR ViewDefinition
 * @param overrideOptions - the `ParseOptions` from effect
 * @returns a decoded Data 'land' ViewDefinition
 */
export const decodeSync = Schema.decodeSync(ViewDefinition);
export const ok = Schema.is(Schema.encodedSchema(ViewDefinition));
/**
 * Super set Resource Schema ctor
 * that only checks for a resource's resourceType
 * field existing. Treats the rest of the JSON object
 * as an arbitrary (key, value) record.
 */
const _Resource = Schema.Struct({
    resourceType: Schema.String,
}, { key: Schema.String, value: Schema.Any });
;
export const Resource = _Resource;

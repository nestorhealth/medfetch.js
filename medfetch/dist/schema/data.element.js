import { Schema } from "effect";
import * as Primitive from "./primitive";
// shorthand since most FHIR fields
// are exact optional
export const ow = Schema.optionalWith;
export const Period = Schema.Struct({
    start: ow(Schema.String, { exact: true }),
    end: ow(Schema.String, { exact: true }),
});
export const Coding = Schema.Struct({
    system: ow(Schema.String, { exact: true }),
    version: ow(Schema.String, { exact: true }),
    code: ow(Schema.String, { exact: true }),
    display: ow(Schema.String, { exact: true }),
    userSelected: ow(Schema.Boolean, { exact: true }),
});
export const CodeableConcept = Schema.Struct({
    text: Schema.optionalWith(Schema.String, { exact: true }),
    coding: ow(Schema.Array(Coding), { exact: true }),
});
export const Quantity = Schema.Struct({
    value: ow(Schema.Number, { exact: true }),
    comparator: ow(Schema.Literal(">", "<=", ">=", ">"), { exact: true }),
    unit: ow(Schema.String, { exact: true }),
    system: ow(Schema.String, { exact: true }),
    code: ow(Schema.String, { exact: true }),
});
export const SimpleQuantity = Quantity.pick("value", "unit");
export const Range = Schema.Struct({
    low: ow(Quantity.pick("value", "unit"), { exact: true }),
    high: ow(Quantity.pick("value", "unit"), { exact: true }),
});
export const ContactPoint = Schema.Struct({
    system: ow(Schema.Literal("phone", "fax", "email", "pager", "url", "sms", "other"), { exact: true }),
    value: ow(Schema.String, { exact: true }),
    use: ow(Schema.Literal("home", "work", "temp", "old", "mobile"), {
        exact: true,
    }),
    rank: ow(Primitive.positiveInt, { exact: true }),
    period: ow(Period, { exact: true }),
});
export const ContactDetail = Schema.Struct({
    name: ow(Schema.String, { exact: true }),
    telecom: ow(Schema.Array(ContactPoint), { exact: true }),
});
export const Meta = Schema.Struct({
    versionId: ow(Schema.String, { exact: true }),
    lastUpdated: ow(Schema.String, { exact: true }),
    source: ow(Schema.String, { exact: true }),
    profile: ow(Schema.Array(Schema.String), { exact: true }),
    security: ow(Schema.Array(Coding), { exact: true }),
    tag: ow(Schema.Array(Coding), { exact: true }),
});
const _Identifier = Schema.Struct({
    use: Schema.optionalWith(Schema.Literal("usual", "official", "temp", "secondary", "old"), { exact: true }),
    type: ow(CodeableConcept, { exact: true }),
    system: ow(Schema.String, { exact: true }),
    value: ow(Schema.String, { exact: true }),
    period: ow(Period, { exact: true }),
    assigner: ow(Schema.suspend(() => _Reference), { exact: true }),
});
export const Identifier = _Identifier;
const _Reference = Schema.Struct({
    reference: ow(Schema.String, { exact: true }),
    type: ow(Schema.String, { exact: true }),
    identifier: ow(Schema.suspend(() => _Identifier), { exact: true }),
    display: ow(Schema.String, { exact: true }),
});
export const Reference = _Reference;
export const UsageContext = Schema.Struct({
    code: Coding,
    valueCodeableConcept: ow(CodeableConcept, { exact: true }),
    valueQuantity: ow(Quantity, { exact: true }),
    valueRange: ow(Range, { exact: true }),
    valueReference: ow(_Reference, { exact: true }),
});

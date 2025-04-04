import { Schema } from "effect";
export function isSystemType(fhirType) {
    return (fhirType === "System.String" ||
        fhirType === "System.Boolean" ||
        fhirType === "System.Date" ||
        fhirType === "System.DateTime" ||
        fhirType === "System.Time" ||
        fhirType === "System.Integer" ||
        fhirType === "System.Decimal");
}
export function isPrimitiveType(fhirType) {
    return (fhirType === "id" ||
        fhirType === "uri" ||
        fhirType === "oid" ||
        fhirType === "url" ||
        fhirType === "code" ||
        fhirType === "base64Binary" ||
        fhirType === "time" ||
        fhirType === "uuid" ||
        fhirType === "canonical" ||
        fhirType === "string" ||
        fhirType === "xhtml" ||
        fhirType === "date" ||
        fhirType === "dateTime" ||
        fhirType === "boolean" ||
        fhirType === "markdown" ||
        fhirType === "instant" ||
        fhirType === "decimal" ||
        fhirType === "integer" ||
        fhirType === "unsignedInt" ||
        fhirType === "positiveInt");
}
export const FhirType = Schema.Literal(...[
    "Resource",
    "BackboneElement",
    "Reference",
    "Extension",
    "System.String",
    "positiveInt",
    "string",
    "boolean",
    "Period",
    "Identifier",
    "uri",
    "code",
    "Meta",
    "Narrative",
    "CodeableConcept",
    "date",
    "ContactDetail",
    "markdown",
    "dateTime",
    "Dosage",
    "Expression",
    "canonical",
    "Quantity",
    "RelatedArtifact",
    "Age",
    "Duration",
    "Range",
    "Timing",
    "UsageContext",
    "decimal",
    "Annotation",
    "instant",
    "unsignedInt",
    "base64Binary",
    "url",
    "Coding",
    "integer",
    "Attachment",
    "Signature",
    "ContactPoint",
    "Money",
    "Address",
    "time",
    "Element",
    "ProdCharacteristic",
    "ProductShelfLife",
    "Ratio",
    "id",
    "Contributor",
    "Count",
    "DataRequirement",
    "Distance",
    "HumanName",
    "oid",
    "ParameterDefinition",
    "SampledData",
    "TriggerDefinition",
    "uuid",
    "MarketingStatus",
    "Population",
    "xhtml",
    "ElementDefinition",
    "SubstanceAmount",
    "System.Boolean",
    "System.Date",
    "System.DateTime",
    "System.Decimal",
    "System.Integer",
    "System.Time",
]);
export const isFhirType = (u) => typeof u === "string" && FhirType.literals.includes(u);

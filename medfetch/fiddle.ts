import OpenAI from "openai";
import "dotenv/config";
import fs from "node:fs";

const RESOURCE_LIST = [
    "Account",
    "ActivityDefinition",
    "Address",
    "AdverseEvent",
    "Age",
    "AllergyIntolerance",
    "Annotation",
    "Appointment",
    "AppointmentResponse",
    "Attachment",
    "AuditEvent",
    "BackboneElement",
    "Basic",
    "Binary",
    "BiologicallyDerivedProduct",
    "BodyStructure",
    "Bundle",
    "CapabilityStatement",
    "CarePlan",
    "CareTeam",
    "CatalogEntry",
    "ChargeItem",
    "ChargeItemDefinition",
    "Claim",
    "ClaimResponse",
    "ClinicalImpression",
    "CodeSystem",
    "CodeableConcept",
    "Coding",
    "Communication",
    "CommunicationRequest",
    "CompartmentDefinition",
    "Composition",
    "ConceptMap",
    "Condition",
    "Consent",
    "ContactDetail",
    "ContactPoint",
    "Contract",
    "Contributor",
    "Count",
    "Coverage",
    "CoverageEligibilityRequest",
    "CoverageEligibilityResponse",
    "DataRequirement",
    "DetectedIssue",
    "Device",
    "DeviceDefinition",
    "DeviceMetric",
    "DeviceRequest",
    "DeviceUseStatement",
    "DiagnosticReport",
    "Distance",
    "DocumentManifest",
    "DocumentReference",
    "DomainResource",
    "Dosage",
    "Duration",
    "EffectEvidenceSynthesis",
    "Element",
    "ElementDefinition",
    "Encounter",
    "Endpoint",
    "EnrollmentRequest",
    "EnrollmentResponse",
    "EpisodeOfCare",
    "EventDefinition",
    "Evidence",
    "EvidenceVariable",
    "ExampleScenario",
    "ExplanationOfBenefit",
    "Expression",
    "Extension",
    "FamilyMemberHistory",
    "Flag",
    "Goal",
    "GraphDefinition",
    "Group",
    "GuidanceResponse",
    "HealthcareService",
    "HumanName",
    "Identifier",
    "ImagingStudy",
    "Immunization",
    "ImmunizationEvaluation",
    "ImmunizationRecommendation",
    "ImplementationGuide",
    "InsurancePlan",
    "Invoice",
    "Library",
    "Linkage",
    "List",
    "Location",
    "MarketingStatus",
    "Measure",
    "MeasureReport",
    "Media",
    "Medication",
    "MedicationAdministration",
    "MedicationDispense",
    "MedicationKnowledge",
    "MedicationRequest",
    "MedicationStatement",
    "MedicinalProduct",
    "MedicinalProductAuthorization",
    "MedicinalProductContraindication",
    "MedicinalProductIndication",
    "MedicinalProductIngredient",
    "MedicinalProductInteraction",
    "MedicinalProductManufactured",
    "MedicinalProductPackaged",
    "MedicinalProductPharmaceutical",
    "MedicinalProductUndesirableEffect",
    "MessageDefinition",
    "MessageHeader",
    "Meta",
    "MetadataResource",
    "MolecularSequence",
    "Money",
    "NamingSystem",
    "Narrative",
    "NutritionOrder",
    "Observation",
    "ObservationDefinition",
    "OperationDefinition",
    "OperationOutcome",
    "Organization",
    "OrganizationAffiliation",
    "ParameterDefinition",
    "Parameters",
    "Patient",
    "PaymentNotice",
    "PaymentReconciliation",
    "Period",
    "Person",
    "PlanDefinition",
    "Population",
    "Practitioner",
    "PractitionerRole",
    "Procedure",
    "ProdCharacteristic",
    "ProductShelfLife",
    "Provenance",
    "Quantity",
    "Questionnaire",
    "QuestionnaireResponse",
    "Range",
    "Ratio",
    "Reference",
    "RelatedArtifact",
    "RelatedPerson",
    "RequestGroup",
    "ResearchDefinition",
    "ResearchElementDefinition",
    "ResearchStudy",
    "ResearchSubject",
    "Resource",
    "RiskAssessment",
    "RiskEvidenceSynthesis",
    "SampledData",
    "Schedule",
    "SearchParameter",
    "ServiceRequest",
    "Signature",
    "Slot",
    "Specimen",
    "SpecimenDefinition",
    "StructureDefinition",
    "StructureMap",
    "Subscription",
    "Substance",
    "SubstanceAmount",
    "SubstanceNucleicAcid",
    "SubstancePolymer",
    "SubstanceProtein",
    "SubstanceReferenceInformation",
    "SubstanceSourceMaterial",
    "SubstanceSpecification",
    "SupplyDelivery",
    "SupplyRequest",
    "Task",
    "TerminologyCapabilities",
    "TestReport",
    "TestScript",
    "Timing",
    "TriggerDefinition",
    "UsageContext",
    "ValueSet",
    "VerificationResult",
    "VisionPrescription"
];

const fhirJSONSchema = JSON.parse(fs.readFileSync("fhir.schema.json", "utf8"));

const nlQuery = "get me all patients with colonoscopy";
const client = new OpenAI();

const messages = [
    { role: "system", content: "You are an AI that translates natural language to SQL queries. The first step figure out which FHIR resources you would need to pull to carry out the query. In this step, you do not need to make any sql queries yet. Instead just list which FHIR resources the user needs to pull from. You will provide two outputs, a conversational one that is a direct response to the user, and then another output where you simply list the resources as strings in an array" },
    { role: "system", content: `FHIR Resources to pull: ${RESOURCE_LIST.join(", ")}` },
    { role: "system", content: "Using the above information, first figure out which FHIR resources you would need to pull to carry out the query. After finding the resources, ask the user what variables/elements they want from each resource. Even if the user doesn't specify the surrogate id field, ALWAYS include that in the final json_extract calls for every resource." },
    { role: "user", content: nlQuery },
];

const response = await client.responses.create({
    model: "gpt-4o-2024-08-06",
    input: messages,
    text: {
        format: {
            type: "json_schema",
            name: "conversation_string_array",
            schema: {
                type: "object",
                properties: {
                    conversation: {
                        type: "string"
                    },
                    resources: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                required: ["conversation", "resources"],
                additionalProperties: false
            },
        }
    },
    store: true
});

type Conversational<T> = {
    conversation: string;
} & T;

const parse = (text: string) => JSON.parse(text) as Conversational<{ resources: string[] }>;

const { resources, conversation } = parse(response.output_text);
const jsonSchemas = Object.fromEntries(resources.map((resource) => {
    const schema = fhirJSONSchema["definitions"][resource];
    const properties = Object.fromEntries(Object.entries(schema["properties"]).filter(([key]) => !key.startsWith("_")));
    const newSchema = { ...schema, properties };
    return [resource, newSchema] as const;
}));

console.log(conversation);

const systemMessage1 = { role: "system", content: `Here is the corresponding schema for each of these resource types that the app is expecting to receive from the FHIR server, given as a JavaScript object text ${JSON.stringify(jsonSchemas)}` };
const systemMessage2 = { role: "system", content: `Based on the user's response, infer which properties they would need to pull. In the "aux_sql" field, output the json_extracts from a generic TEXT column named 'json', which you will assume has the JSON data for the pulled data in plaintext. Ensure you specifically do NOT include the "resourceType" field, as you can assume each table that will have this extraction performed will contain only the corresponding resource of that type for that table. The one other stipulation I will add is instead of making the FROM clause a plain table, assume there is a table-valued-function called medfetch, which can effectively be substituted for the table name by simply calling medfetch(), and passing into arg0 a text literal with the corresponding resource.` };
const systemMessage3 = { role: "system", content: `Then in another response, in the 'conversation' field, you will respond directly to the user, asking if the following tables generated, which the application will derive the view for from the sql you outputted, suits their needs. Continue asking until the user indicates they are OK with the tables. Once they indicate so, you will ask which of these variables they want to keep in their final result set. Based on their response, you will now finally write the final SQL needed to carry out their original query in the "final_sql" field. On the edge case they indicate they want to keep all of them, you will write out the column selects in the SELECT clause for every single column, aliasing each with the name of the table but lowercased, followed by an underscore, then appended with the column name. `};

const userReponse1 = { role: "user", content: "For Patient: birth date and gender. For Procedure: date and outcome" };

const response2 = await client.responses.create({
    model: "gpt-4o-2024-08-06",
    previous_response_id: response.id,
    input: [systemMessage1, systemMessage2, systemMessage3],
    store: true,
    text: {
        format: {
            type: "json_schema",
            name: "conversation_string_array",
            schema: {
                type: "object",
                properties: {
                    conversation: {
                        type: "string"
                    },
                    aux_sql: {
                        type: "string"
                    },
                    final_sql: {
                        type: "string"
                    }
                },
                required: ["conversation", "aux_sql", "final_sql"],
                additionalProperties: false
            },
        }
    },
});

const parse2 = (text: string) => JSON.parse(text) as Conversational<{ final_sql: string; aux_sql: string; }>;

const response2Parsed = parse2(response2.output_text);

console.log("AUX", response2Parsed.aux_sql);
console.log("CONVERSATION", response2Parsed.conversation);


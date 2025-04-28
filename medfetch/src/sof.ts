import { pipe } from "effect";
import { evaluate, UserInvocationTable } from "fhirpath";
import { type ViewDefinition, type Node, $match, Select } from "./view";
import { value, when, orElse } from "effect/Match";
import { set } from "effect/Record";

const userInvocationTable: UserInvocationTable = {
    getResourceKey: {
        fn: (inputs: any[]) => {
            return inputs.map((i) => i.id);
        },
        arity: { 0: [] },
    },
    getReferenceKey: {
        fn: (inputs: any[], _type?: string) =>
            inputs.map((input: Reference) => getReferenceKey(input)),
        arity: { 0: [], 1: ["String"] },
    },
    code: {
        fn: (inputs: CodeableConcept[]) =>
            inputs.flatMap((input) => {
                return input.coding?.map(
                    (coding) =>
                        `${codeSystemAlias(coding.system)}#${coding.code ?? "NOCODE"}`,
                );
            }),
        arity: { 0: [] },
    },
};

function evaluateSync(data: any | any[], path: string): any[] {
    return evaluate(data, path, undefined, undefined, {
        userInvocationTable,
        async: false,
    });
}

interface Reference {
    reference: string;
}
interface CodeableConcept {
    coding: {
        code: string;
        system: string;
    }[];
}

function codeSystemAlias(codeSystem: string | undefined) {
    return value(codeSystem).pipe(
        when(undefined, () => "UNKNOWN"),
        when("http://loinc.org", () => "LOINC"),
        when("http://snomed.info/sct", () => "SCT"),
        when("http://www.ama-assn.org/go/cpt", () => "CPT"),
        when("http://hl7.org/fhir/sid/icd-10", () => "ICD10"),
        when("http://hl7.org/fhir/sid/icd-9", () => "ICD9"),
        when("http://www.nlm.nih.gov/research/umls/rxnorm", () => "RXNORM"),

        // Match.when((cs) => cs.startsWith("http://hl7.org/fhir/sid/icd"), () => "ICD"),
        when(
            (codeSystem) => codeSystem.startsWith("http://terminology.hl7.org"),
            () => "FHIR",
        ),
        orElse((codeSystem) => {
            console.error(`I don't know this code system ${codeSystem}`);
            return "UNKNOWN";
        }),
    );
}

function getReferenceKey({ reference }: { reference: string }) {
    // idk
    if (reference === undefined) return null;

    // "urn:uuid:<reference>" case
    if (reference.startsWith("urn")) return reference.slice(9);

    const split = reference.split("/");
    // "<Resource>/id" relative reference case
    if (split.length === 2) return split[1];

    // Don't handle
    return null;
}

/**
 * The main sql-on-fhir workhorse function. Flat maps the projection
 * of data recursively to yield a flat array
 * OR...
 * [[ project nd data ]] is the flattened projection of data into (column_name, column_path_value) records.
 * @param nd - a view-definition SELECT node
 * @param data - the resources to project to rows
 * @returns a flattened row view of the given resources
 */
export function project(nd: Node, data: any[]): any[] {
    return $match(nd, {
        ForEach: ({ forEach, select }) =>
            data.flatMap((resource) => {
                const items = evaluateSync(resource, forEach);
                return items.flatMap((item) => project(Select({ select }), [item]));
            }),

        ForEachOrNull: ({ forEachOrNull, select }) =>
            data.flatMap((resource) => {
                const items = evaluateSync(resource, forEachOrNull);
                if (items.length === 0) return project(Select({ select }), [{}]);
                return items.flatMap((item) => project(Select({ select }), [item]));
            }),

        Select: ({ select }) =>
            data.flatMap((resource) =>
                select.reduce((acc, selectNode) => {
                    const results = project(selectNode, [resource]);
                    if (acc.length === 0) return results;
                    return acc.flatMap((row) => {
                        return results.map((newRow) => {
                            return {
                                ...row,
                                ...newRow,
                            };
                        });
                    });
                }, [] as any[]),
            ),

        UnionAll: ({ unionAll }) =>
            unionAll.flatMap((subQuery) => project(subQuery, data)),

        Column: ({ column }) =>
            data.map((resource) =>
                column.reduce(
                    (acc, col) =>
                        pipe(evaluateSync(resource, col.path), (value) =>
                            set(
                                acc,
                                col.name,
                                col.collection ? value : (value[0] ?? null),
                            ),
                        ),
                    {} as any,
                ),
            ),
    });
}

/**
 * The public api that filters the data based on the WHERE query in a ViewDefinition,
 * then passes data off to project
 * @param viewDefinition - the normalized and tagged ViewDefinition
 * @param data - the resources to project
 * @returns the 'rowified' json resources
 */
export function flat(data: any[], viewDefinition: ViewDefinition): any[] {
    let matching = data.filter(data => data.resourceType === viewDefinition.resource);
    if (matching.length === 0)
        return matching;

    for (const { path } of viewDefinition.where ?? [])
        matching = matching.filter(data => evaluateSync(data, `where(${path})`).length > 0);

    return project(viewDefinition, matching);
}

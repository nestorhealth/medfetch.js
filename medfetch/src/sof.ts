import { Array, Match, pipe, Record } from "effect";
import { evaluate, UserInvocationTable } from "fhirpath";
import { type ViewDefinition, type Node, $match, Select } from "./view";

interface Reference {
    reference: string;
}
interface CodeableConcept {
    coding: {
        code: string;
        system: string;
    }[]
}

function codeSystemAlias(codeSystem: string | undefined) {
    return Match.value(codeSystem).pipe(
        Match.when(undefined, () => "UNKNOWN"),
        Match.when("http://loinc.org", () => "LOINC"),
        Match.when("http://snomed.info/sct", () => "SCT"),
        Match.when("http://www.ama-assn.org/go/cpt", () => "CPT"),
        Match.when("http://hl7.org/fhir/sid/icd-10", () => "ICD10"),
        Match.when("http://hl7.org/fhir/sid/icd-9", () => "ICD9"),
        Match.when(
            "http://www.nlm.nih.gov/research/umls/rxnorm",
            () => "RXNORM",
        ),

        // Match.when((cs) => cs.startsWith("http://hl7.org/fhir/sid/icd"), () => "ICD"),
        Match.when(
            (codeSystem) => codeSystem.startsWith("http://terminology.hl7.org"),
            () => "FHIR",
        ),
        Match.orElse((codeSystem) => {
            console.error(`I don't know this code system ${codeSystem}`);
            return "UNKNOWN";
        }),
    );
}

function getReferenceKey({ reference }: { reference: string; }) {
    // idk
    if (reference === undefined) {
        return null;
    }

    // "urn:uuid:<reference>" case
    if (reference.startsWith("urn")) {
        return reference.slice(9);
    }
    
    const split = reference.split("/");
    // "<Resource>/id" relative reference case
    if (split.length === 2) {
        return split[1];
    }
    
    // Don't handle 
    return null;
}

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

export const evaluateSync = (data: any, path: string): any[] =>
    evaluate(data, path, undefined, undefined, {
        userInvocationTable,
        async: false,
    });

/**
 * The main sql-on-fhir workhorse function. Flat maps the projection
 * of data recursively to yield a flat array
 * OR...
 * [[ project nd data ]] is the flattened projection of data into (column_name, column_path_value) records.
 * @param nd - a view-definition SELECT node
 * @param data - the resources to project to rows
 * @returns a flattened row view of the given resources
 */
export function project(
    nd: Node,
    data: any | any[],
    evaluate: (data: any[], expr: string) => any[],
): any[] {
    const aux = (nd: Node, data: any[]): any[] => {
        return $match(nd, {
            ForEach: ({ forEach, select }) =>
                data.flatMap((resource) => {
                    const items = evaluate(resource, forEach);
                    return items.flatMap((item) =>
                        aux(Select({ select }), [item]),
                    );
                }),

            ForEachOrNull: ({ forEachOrNull, select }) =>
                data.flatMap((resource) => {
                    const items = evaluate(resource, forEachOrNull);
                    if (items.length === 0) {
                        return aux(Select({ select }), [{}]);
                    }
                    return items.flatMap((item) =>
                        aux(Select({ select }), [item]),
                    );
                }),

            Select: ({ select }) =>
                Array.flatMap(data, (resource) => {
                    return Array.reduce(
                        select,
                        [] as any[],
                        (acc, selectNode) => {
                            const results = aux(selectNode, [resource]);
                            if (acc.length === 0) {
                                return results;
                            }
                            return Array.flatMap(acc, (row) => {
                                return Array.map(results, (newRow) => {
                                    return {
                                        ...row,
                                        ...newRow,
                                    };
                                });
                            });
                        },
                    );
                }),

            UnionAll: ({ unionAll }) =>
                unionAll.flatMap((subQuery) => aux(subQuery, data)),

            Column: ({ column }) =>
                Array.map(data, (resource) =>
                    Array.reduce(column, {} as any, (acc, col) => {
                        return pipe(evaluate(resource, col.path), (value) =>
                            Record.set(
                                acc,
                                col.name,
                                col.collection ? value : (value[0] ?? null),
                            ),
                        );
                    }),
                ),
        });
    };
    return aux(nd, data);
}

/**
 * The public api that filters the data based on the WHERE query in a ViewDefinition
 * before calling the column projector [[ columns ]].
 *
 * ...meaning [[ rows viewDefinition data ]] is a flat array of rows derived from the columns vd.select
 *
 * @param viewDefinition - the normalized and tagged ViewDefinition
 * @param data - the resources to project
 * @returns the 'rowified' json resources
 */
export function sof(
    viewDefinition: ViewDefinition,
    data: any[],
): any[] {
    let filtered = data.filter(
        (data) => data.resourceType === viewDefinition.resource,
    );
    if (filtered.length === 0) {
        return [];
    }

    const doEvaluate = (data: any | any[], expr: string) => {
        return evaluate(data, expr, {}, undefined, {
            async: false,
            userInvocationTable,
        });
    };

    for (const { path } of viewDefinition.where ?? []) {
        filtered = Array.filter(filtered, (resource) => {
            return doEvaluate(resource, `where(${path})`).length > 0;
        });
    }

    return project(viewDefinition, filtered, doEvaluate);
}

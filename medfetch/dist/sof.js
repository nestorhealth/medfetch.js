import { Array, Match, pipe, Record } from "effect";
import { evaluate } from "fhirpath";
import fhir_r4_model from "fhirpath/fhir-context/r4";
import { View } from "./schema";
function codeSystemAlias(codeSystem) {
    return Match.value(codeSystem).pipe(Match.when(undefined, () => "UNKNOWN"), Match.when("http://loinc.org", () => "LOINC"), Match.when("http://snomed.info/sct", () => "SCT"), Match.when("http://www.ama-assn.org/go/cpt", () => "CPT"), Match.when("http://hl7.org/fhir/sid/icd-10", () => "ICD10"), Match.when("http://hl7.org/fhir/sid/icd-9", () => "ICD9"), Match.when("http://www.nlm.nih.gov/research/umls/rxnorm", () => "RXNORM"), 
    // Match.when((cs) => cs.startsWith("http://hl7.org/fhir/sid/icd"), () => "ICD"),
    Match.when((codeSystem) => codeSystem.startsWith("http://terminology.hl7.org"), () => "FHIR"), Match.orElse((codeSystem) => {
        console.error(`I don't know this code system ${codeSystem}`);
        return "UNKNOWN";
    }));
}
function getReferenceKey({ reference }) {
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
const userInvocationTable = {
    getResourceKey: {
        fn: (inputs) => {
            return inputs.map((i) => i.id);
        },
        arity: { 0: [] },
    },
    getReferenceKey: {
        fn: (inputs, type) => inputs.map((input) => getReferenceKey(input)),
        arity: { 0: [], 1: ["String"] },
    },
    code: {
        fn: (inputs) => inputs.flatMap((input) => {
            return input.coding?.map((coding) => `${codeSystemAlias(coding.system)}#${coding.code ?? "NOCODE"}`);
        }),
        arity: { 0: [] },
    },
};
export const evaluateSync = (data, path) => evaluate(data, path, undefined, fhir_r4_model, {
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
export function project(nd, data, evaluate) {
    const aux = (nd, data) => {
        return View.$match(nd, {
            ForEach: ({ forEach, select }) => data.flatMap((resource) => {
                const items = evaluate(resource, forEach);
                return items.flatMap((item) => aux(View.Select({ select }), [item]));
            }),
            ForEachOrNull: ({ forEachOrNull, select }) => data.flatMap((resource) => {
                const items = evaluate(resource, forEachOrNull);
                if (items.length === 0) {
                    return aux(View.Select({ select }), [{}]);
                }
                return items.flatMap((item) => aux(View.Select({ select }), [item]));
            }),
            Select: ({ select }) => Array.flatMap(data, (resource) => {
                return Array.reduce(select, [], (acc, selectNode) => {
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
                });
            }),
            UnionAll: ({ unionAll }) => unionAll.flatMap((subQuery) => aux(subQuery, data)),
            Column: ({ column }) => Array.map(data, (resource) => Array.reduce(column, {}, (acc, col) => {
                return pipe(evaluate(resource, col.path), (value) => Record.set(acc, col.name, col.collection ? value : (value[0] ?? null)));
            })),
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
export function sof(viewDefinition, data) {
    let filtered = data.filter((data) => data.resourceType === viewDefinition.resource);
    if (filtered.length === 0) {
        return [];
    }
    const constantsMap = Array.reduce(viewDefinition.constant, {}, (acc, constant) => {
        return Record.set(acc, constant.name, View.getConstantValue(constant));
    });
    const doEvaluate = (data, expr) => {
        return evaluate(data, expr, constantsMap, fhir_r4_model, {
            async: false,
            userInvocationTable,
        });
    };
    for (const { path } of viewDefinition.where) {
        filtered = Array.filter(filtered, (resource) => {
            return doEvaluate(resource, `where(${path})`).length > 0;
        });
    }
    return project(viewDefinition, filtered, doEvaluate);
}

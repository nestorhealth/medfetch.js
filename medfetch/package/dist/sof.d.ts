import { type ViewDefinition, type Node } from "./view";
export declare const evaluateSync: (data: any, path: string) => any[];
/**
 * The main sql-on-fhir workhorse function. Flat maps the projection
 * of data recursively to yield a flat array
 * OR...
 * [[ project nd data ]] is the flattened projection of data into (column_name, column_path_value) records.
 * @param nd - a view-definition SELECT node
 * @param data - the resources to project to rows
 * @returns a flattened row view of the given resources
 */
export declare function project(nd: Node, data: any | any[], evaluate: (data: any[], expr: string) => any[]): any[];
/**
 * The public api that filters the data based on the WHERE query in a ViewDefinition
 * before calling the column projector [[ columns ]].
 *
 * ...meaning [[ flat viewDefinition data ]] is a flat array of rows derived from the columns vd.select
 *
 * @param viewDefinition - the normalized and tagged ViewDefinition
 * @param data - the resources to project
 * @returns the 'rowified' json resources
 */
export declare function flat(data: any[], viewDefinition: ViewDefinition): any[];

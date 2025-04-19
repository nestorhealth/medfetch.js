import { flat } from "./sof";
export { flat };
export { normalize, Select as select, ForEach as forEach, ForEachOrNull as forEachOrNull, UnionAll as unionAll, } from "./view";
export type { ViewDefinition, ColumnPath, Node, Column, Select, ForEach, ForEachOrNull, UnionAll, Constant, } from "./view";
import { viewDefinition, columnPath, Column as column } from "./view";
export { viewDefinition, columnPath, column };
type Last<Path extends string> = Path extends `${infer _}.${infer Rest}` ? Last<Rest> : Path;
type Flattened<Fields extends readonly string[]> = {
    [K in Fields[number] as Last<K>]: unknown;
};
export type SOF = <ResourceType extends string, Keys extends readonly string[]>(resourceType: ResourceType, keys: readonly [...Keys]) => Promise<Flattened<Keys>[]>;
/**
 * Get an in-memory sql-on-fhir runner (aka View Runner)
 * @param baseURL The FHIR server base
 * @returns sof The sql-on-fhir runner, which is just a function
 */
export declare function medfetch(baseURL: string): SOF;

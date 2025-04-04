import { View } from "./schema";
export declare function getViewDefinitionQuery(args: string[]): string | null;
type TableReference = {
    path: string;
    alias: string;
    joinType: "from" | "inner" | "left";
};
export declare function extractTables(query: string): TableReference[];
export declare function queryToViewDefinition(vtabName: string, query: string): View.ViewDefinition;
export {};

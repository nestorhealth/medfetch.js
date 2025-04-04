import { FhirType, View } from "./schema";
export declare function getFetchPath(): string;
/**
 * Gets insertion placeholders
 * for multiple rows
 * @param numRows - the number of rows
 * @param numColumns - how many columns does the row have?
 * @returns - SQLite placeholder text
 */
export declare function placeholders(numRows: number, numColumns: number): string;
/**
 * Flattens the projected `rows` values
 * to be used for an `INSERT INTO` statement.
 * @param rows - the rows to insert
 * @returns the insertion text
 */
export declare function flatValues(rows: any[]): ({} | null | undefined)[];
export declare function getColumnType(type: FhirType): "TEXT" | "REAL" | "INTEGER";
export declare function processConstraints(columnPath: View.ColumnPath): string;
export declare function tableMigration(viewDefinition: View.ViewDefinition): string;

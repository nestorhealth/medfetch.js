import { Array as Arrayh, Match, pipe } from "effect";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FhirType, isPrimitiveType, isSystemType, View } from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getFetchPath() {
    const platform = os.platform();
    const arch = os.arch();

    if (platform === "linux") {
        if (arch === "x64") {
            return path.resolve(__dirname, "..", "bin", "linux-x86", "medfetch");
        }
        throw new Error(`${arch} on linux not supported right now`);
    } else if (platform === "darwin") {
        if (arch === "x64") {
            return path.resolve(__dirname, "..", "bin", "mac-x86", "medfetch");
        }
        throw new Error(`${arch} on mac not supported right now`);
    }
    throw new Error(`Couldn't resolve the platform ${platform}`);
}

/**
 * Gets insertion placeholders
 * for multiple rows
 * @param numRows - the number of rows
 * @param numColumns - how many columns does the row have?
 * @returns - SQLite placeholder text
 */
export function placeholders(numRows: number, numColumns: number) {
    return Array(numRows)
        .fill(`(${Array(numColumns).fill("?").join(",")})`)
        .join(",");
}

/**
 * Flattens the projected `rows` values
 * to be used for an `INSERT INTO` statement.
 * @param rows - the rows to insert
 * @returns the insertion text
 */
export function flatValues(rows: any[]) {
    return rows.flatMap((row) =>
        Object.values(row).map((value) => {
            if (value === null) {
                return null;
            } else {
                if (typeof value === "boolean") {
                    return value ? 1 : 0;
                } else if (Array.isArray(value) || typeof value === "object") {
                    return JSON.stringify(value);
                } else {
                    return value;
                }
            }
        }),
    );
}

export function getColumnType(type: FhirType) {
    return Match.value(type).pipe(
        Match.when(isSystemType, (systemType) => {
            if (
                systemType === "System.String" ||
                systemType === "System.Date" ||
                systemType === "System.Time" ||
                systemType === "System.DateTime"
            ) {
                return "TEXT";
            } else if (systemType === "System.Decimal") {
                return "REAL";
            } else {
                return "INTEGER";
            }
        }),
        Match.when(isPrimitiveType, (primitiveType) => {
            if (
                primitiveType === "integer" ||
                primitiveType === "unsignedInt" ||
                primitiveType === "positiveInt" ||
                primitiveType === "boolean"
            ) {
                return "INTEGER";
            } else if (primitiveType === "decimal") {
                return "REAL";
            } else {
                return "TEXT";
            }
        }),
        Match.orElse((): "TEXT" => "TEXT"),
    );
}

export function processConstraints(columnPath: View.ColumnPath) {
    const constraints: string[] = [];

    if (columnPath.path.endsWith(`getResourceKey()`)) {
        constraints.push(`PRIMARY KEY`);
    }

    return pipe(
        columnPath.tags,
        Arrayh.reduce(constraints, (acc, tag) => {
            return [...acc, tag.value];
        }),
        Arrayh.join(" "),
    );
}

export function tableMigration(viewDefinition: View.ViewDefinition) {
    return pipe(viewDefinition, View.getColumns, (columns) =>
        Arrayh.reduce(
            columns,
            `CREATE TABLE "${viewDefinition.name}" (\n`,
            (acc, column, index) => {
                acc += `\t"${column.name}"`;
                if (column.collection) {
                    acc += " " + `TEXT`;
                } else {
                    acc += " " + getColumnType(column.type);
                }

                const constraints = processConstraints(column);
                if (constraints.length > 0) {
                    acc += " " + processConstraints(column);
                }

                if (index < columns.length - 1) {
                    return acc + `,\n`;
                } else {
                    return acc + `\n` + `);\n`; // End migration
                }
            },
        ),
    );
}

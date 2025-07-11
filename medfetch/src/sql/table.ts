import { makeError } from "~/context";
import { type Walk } from "~/json/walk";

const exception = makeError("medfetch/sql.table");

/**
 * Extracts the table name from a CREATE TABLE SQL statement.
 * - Quoted table names preserve casing.
 * - Unquoted table names are lowercased.
 *
 * @param createSQL The CREATE TABLE SQL string
 * @returns The normalized table name, or null if not found
 */
export function getTableName(createSQL: string): string | null {
    const trimmed = createSQL.trim();
    const match = trimmed.match(
        /^CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+(?:(["'`])([^\s"'`()]+)\1|([^\s"'`()]+))/i,
    );

    if (!match) return null;

    const quotedName = match[2];
    const unquotedName = match[3];

    return quotedName ?? unquotedName?.toLowerCase() ?? null;
}

/**
 * Extracts all table names from a ';'-separated plaintext string
 * of `CREATE TABLE` statements. It is plural version of {@link getTableName}
 * @param sqlText The querytext as a plain string
 * @returns The list of table names found, including an empty array if no matches were found.
 */
export function getTableNames(sqlText: string): string[] {
    const regex =
        /CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+(?:(["'`])([^\s"'`()]+)\1|([^\s"'`()]+))/gi;
    return [...sqlText.matchAll(regex)].map((match) => {
        const quoted = match[2];
        const unquoted = match[3];
        return quoted ?? unquoted?.toLowerCase() ?? "";
    });
}

/**
 * Just a 2-tuple of strings with elements:
 * - [`0`] -> Table Name
 * - [`1`] -> The full migration text of that table
 */
type TableSQLEntry = [
    /**
     * Table name in the database
     */
    tableName: string,

    /**
     * The migration text for it
     */
    migrationText: string,
];

/**
 * Transform a 'migration' sql plaintext comprised of "create table" statements into a {@link TableSQLEntry} list.
 * @param createTables The migration plaintext
 * @returns tables in migrations grouped with their migration text
 *
 * @example
 * ```ts
 * const migrationEntries = entries("create table foo (id text);");
 * migrationEntries.forEach(
 *   me => console.log("Migration Entry =", me);
 *   // Output: Migration entry = ["foo", "create table foo (id text);"]
 * );
 * ```
 *
 */
export function entries(createTables: string): TableSQLEntry[] {
    return createTables
        .trim()
        .split(";")
        .map((migration) => [getTableName(migration), migration] as const)
        .filter((migration): migration is [string, string] => !!migration[0]);
}

/**
 * The js-land representation of the virtual-table metadata medfetch needs in order
 * to look up the user-defined virtual table columns from its postgres / sqlite extension.
 * This is ***not*** the same as an [sqlite virtual table](https://www.sqlite.org/vtab.html),
 * since this also (will) works with the [Postgres FDW API](https://www.postgresql.org/docs/current/postgres-fdw.html).
 * Medfetch was implemented on sqlite first, this name remains since it does a good enough job
 * (who cares about typescript types they're all fake anyway)
 */
type VirtualTable = {
    /**
     * The plaintext sql string to pass into the virtual/foreign table adapter of the database
     */
    readonly statement: string;

    /**
     * map column index -> column resolution function
     */
    readonly lookupForeignColumn: ReadonlyMap<
        number,
        (json: unknown) => unknown
    >;
};

export function virtualTable(
    fullStatement: string,
    walk: Walk,
    constraints = false,
): VirtualTable {
    const createPrefix = /^create\s+table\s+["'`]?(.*?)["'`]?\s*\(/i;
    const match = fullStatement.match(createPrefix);
    if (!match) {
        return exception(
            "Invalid create table (missing prefix): ",
            fullStatement,
        );
    }

    const tableName = match[1];
    const rest = fullStatement.slice(match[0].length); // after opening paren

    // Find closing paren of column list
    let depth = 1;
    let i = 0;
    for (; i < rest.length; i++) {
        if (rest[i] === "(") depth++;
        else if (rest[i] === ")") depth--;
        if (depth === 0) break;
    }

    if (depth !== 0) {
        return exception(
            "Invalid create table (unmatched parens): ",
            fullStatement,
        );
    }

    const rawCols = rest.slice(0, i); // contents inside parens
    const tail = rest.slice(i + 1).trim();
    if (tail && tail !== ";") {
        return exception(
            "Invalid create table (unexpected suffix): ",
            fullStatement,
        );
    }

    const columnMap = new Map<number, (json: unknown) => unknown>();
    const lines: string[] = [];

    let buffer = "";
    depth = 0;
    let colIndex = 0;

    const pushColumn = (line: string, index: number) => {
        const trimmed = line.trim();

        // Generated column
        const generatedMatch = trimmed.match(
            /^["'`]?(.*?)["'`]?\s+\w+\s+generated\s+always\s+as\s*\((.*?)\)/i,
        );
        if (generatedMatch) {
            const [, name, expr] = generatedMatch;
            const colName = name.trim().replace(/^["'`]|["'`]$/g, "");
            const colExpr = expr.trim();

            lines.push(`"${colName}" TEXT`);
            columnMap.set(index, walk(colExpr));
            return;
        }

        // Regular column
        const fallbackMatch = trimmed.match(/^["'`]?(.*?)["'`]?\s+(\w+)/i);
        if (fallbackMatch) {
            const [, name, type] = fallbackMatch;
            const colName = name.trim().replace(/^["'`]|["'`]$/g, "");

            const colType = type.toUpperCase();
            const columnDef = `"${colName}" ${colType}`;

            lines.push(constraints ? columnDef : trimmed);
            columnMap.set(index, walk(colName));
        } else {
            console.warn("Skipping unrecognized column:", trimmed);
        }
    };

    // Split top-level columns by commas at depth 0
    for (let j = 0; j < rawCols.length; j++) {
        const char = rawCols[j];
        if (char === "(") depth++;
        else if (char === ")") depth--;
        if (char === "," && depth === 0) {
            pushColumn(buffer, colIndex++);
            buffer = "";
        } else {
            buffer += char;
        }
    }

    if (buffer.trim()) {
        pushColumn(buffer, colIndex++);
    }

    return {
        statement: `CREATE TABLE "${tableName}" (${lines.join(", ")});`,
        lookupForeignColumn: columnMap,
    };
}

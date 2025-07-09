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
 * 0 -> Table Name
 * 1 -> The full migration text of that table
 */
type CreateTableEntry = [
    /**
     * Table name in the database
     */
    tableName: string,
    
    /**
     * The migration text for it
     */
    migrationText: string
];

/**
 * Transform a 'migration' sql plaintext comprised of "create table" statements into a {@link CreateTableEntry} list.
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
export function entries(
    createTables: string,
): CreateTableEntry[] {
    return createTables
        .trim()
        .split(";")
        .map((migration) => [getTableName(migration), migration] as const)
        .filter((migration): migration is [string, string] => !!migration[0]);
}

export function columns(tableSql: string): string[] {
  const cleaned = tableSql.trim().replace(/\s+/g, " ");

  // Match the columns inside the parentheses
  const match = cleaned.match(/CREATE\s+TABLE[^(]*\(([\s\S]+)\)/i);
  if (!match) return [];

  const columnBlock = match[1].trim();

  const columns: string[] = [];

  // Simple parser: split on commas but skip ones inside parens (for constraints, e.g., CHECK(x > 0))
  let depth = 0;
  let buffer = "";
  for (const char of columnBlock) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === "," && depth === 0) {
      columns.push(buffer.trim());
      buffer = "";
    } else {
      buffer += char;
    }
  }
  if (buffer) columns.push(buffer.trim());

  // Now extract column names (assumes format: `name type`, and skips constraints)
  return columns
    .filter(line => !/^CONSTRAINT|PRIMARY|FOREIGN|CHECK|UNIQUE/i.test(line))
    .map(line => {
      const match = line.match(/^["`']?([^\s"`']+)/);
      return match?.[1] ?? "";
    })
    .filter(Boolean);
}

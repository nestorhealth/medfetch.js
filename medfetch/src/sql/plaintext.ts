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
    /^CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+(?:(["'`])([^\s"'`()]+)\1|([^\s"'`()]+))/i
  );

  if (!match) return null;

  const quotedName = match[2];
  const unquotedName = match[3];

  return quotedName ?? unquotedName?.toLowerCase() ?? null;
}

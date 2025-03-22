/**
 * Removes comments from an SQL query text string,
 * which are "--" denoted strings for single lines 
 * and "\/\* \*\/" for multi line comments.
 *
 * Can be 1 or many queries, it doesn't care.
 *
 * @param sql the SQL query string
 * @returns the uncommented query
 */
export function removeComments(sql: string) {
    return sql
        .replace(/--.*$/gm, '') // single line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // multi line comments
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n");
}
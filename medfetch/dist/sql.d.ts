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
export declare function removeComments(sql: string): string;

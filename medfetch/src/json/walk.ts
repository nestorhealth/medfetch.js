
/**
 * Factory function that describes how to derive 
 */
export type Walk = (path: string) => (json: unknown) => unknown;

/**
 * Medfetch.js's default implem
 * @param expr 
 * @returns 
 */
export default function walk<T>(
  expr: string,
  mode: "sqlite" | "postgresql" = "sqlite"
): <V>(json: T) => V | null {
  const tokens: { key: string | number; isText: boolean }[] = [];

  const rootMatch = expr.match(/^'?([a-zA-Z_][a-zA-Z0-9_]*|\d+)'?/);
  if (!rootMatch) throw new Error(`Invalid path: ${expr}`);

  const rootKey = /^\d+$/.test(rootMatch[1]) ? Number(rootMatch[1]) : rootMatch[1];
  tokens.push({ key: rootKey, isText: false });

  const regex = /->>?\s*'?([a-zA-Z_][a-zA-Z0-9_]*|\d+)'?/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(expr)) !== null) {
    const full = match[0];
    const rawKey = match[1];
    const isText = full.includes("->>");
    const key = /^\d+$/.test(rawKey) ? Number(rawKey) : rawKey;
    tokens.push({ key, isText });
  }

  return function walkJson<V>(json: any): V | null {
    let current = json;
    for (const { key, isText } of tokens) {
      if (current == null) return null;
      current = current[key];

      if (isText) {
        if (mode === "postgresql") {
          // Always stringify for PostgreSQL ->>
          current = current != null ? String(current) : current;
        }
        // else: SQLite returns native type — do nothing
      }
    }
    return current as V;
  };
}

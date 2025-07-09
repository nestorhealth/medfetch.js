export type Walk = (path: string) => (json: unknown) => unknown;

export default function walk(expr: string): (json: unknown) => unknown {
    const tokens: { key: string; isText: boolean }[] = [];

    // Pull out the root key first: e.g. 'subject' in 'subject'->>'reference'
    const rootMatch = expr.match(/^'?([^'->\s]+)'?/);
    if (!rootMatch) {
        throw new Error(`Invalid path: ${expr}`);
    }

    tokens.push({ key: rootMatch[1], isText: false });

    // Now parse the rest: -> and ->>
    const regex = /->>?\s*'?([^'"]+)'?/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(expr)) !== null) {
        const full = match[0];
        const key = match[1];
        const isText = full.includes("->>");
        tokens.push({ key, isText });
    }

    return (json: unknown) => {
        let current: any = json;

        for (let i = 0; i < tokens.length; i++) {
            if (current == null) return undefined;

            const { key, isText } = tokens[i];
            const isIndex = /^\d+$/.test(key);
            const next = isIndex ? current[+key] : current[key];

            if (i === tokens.length - 1 && isText) {
                return next;
            }

            current = next;
        }

        return current;
    };
}

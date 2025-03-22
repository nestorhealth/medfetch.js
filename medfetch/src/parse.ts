import { ResourceType, View } from "./schema";
import { Array as Arrayh } from "effect";

const reconstruct = (lines: string[]) => {

  const resultLines = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    const nextLine = lines[i + 1]?.trim() ?? "";

    const isNextFromOrJoin = /^(from|inner join|left join|right join|join)\b/i.test(nextLine);
    const isCurrentFromOrJoin = /^(from|inner join|left join|right join|join)\b/i.test(currentLine);

    if (isCurrentFromOrJoin) {
      // Push FROM or JOIN lines without a comma
      resultLines.push(currentLine);
    } else {
      // Add comma unless next line is FROM or JOIN (or this is the last select line)
      const lineWithComma = currentLine + (isNextFromOrJoin || i === lines.length - 1 ? "" : ",");
      resultLines.push(lineWithComma);
    }
  }

  return resultLines.join("\n").trim();
}

export function getViewDefinitionQuery(args: string[]): string | null {
    // dont handle no args for a view definition rebuild,
    // let the caller handle that
    if (args.length <= 3) {
        return null;
    }
    const query = reconstruct(args.slice(3));

    if (!query.toLowerCase().startsWith("select")) {
        return null;
    }
    const fromMatches = query.match(/\bfrom\b/gi);
    if (!fromMatches || fromMatches.length !== 1) {
        return null;
    }
    return query;
}

/**
 * Get the last non function call path segment in a pathstring.
 * e.g. extractPathName("some.path.with().a.function.call()") == "function"
 *
 * @param path the pathstring
 * @returns the path name if it could be found, otherwise returns null
 */
const extractDefaultAlias = (path: string): string | null => {
    const parts = path.split(".");
    for (let i = parts.length - 1; i >= 0; i--) {
        if (!/\w+\(\)$/.test(parts[i])) {
            return parts[i];
        }
    }
    return null;
}

type TableReference = {
    path: string;
    alias: string;
    joinType: "from" | "inner" | "left"; // no right join because a field join on a null resource makes no sense
};

export function extractTables(query: string): TableReference[] {
    const result: TableReference[] = [];

    // Normalize spacing and lowercase keywords for easier matching
    const normalized = query.replace(/\s+/g, " ").trim();

    const regex = /\b(from|inner join|left join|join)\s+([a-zA-Z_][\w]*)(?:\s+as)?\s+([a-zA-Z_][\w]*)?/gi;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(normalized)) !== null) {
        const [_, clause, table, alias] = match;

        // Normalize joinType
        let joinType: TableReference["joinType"];
        if (clause.toLowerCase().startsWith("left")) {
            joinType = "left";
        } else if (clause.toLowerCase().startsWith("inner") || clause.toLowerCase() === "join") {
            joinType = "inner";
        } else {
            joinType = "from";
        }

        result.push({
            path: table,
            alias: alias ?? table,
            joinType,
        });
    }

    return result;
}

const extractSelectExpressions = (query: string): string[] => {
    const lines = query.split("\n").map(line => line.trim());

    let inSelect = false;
    const expressions: string[] = [];

    for (const line of lines) {
        if (/^select\b/i.test(line)) {
            inSelect = true;
            continue;
        }

        if (/^(from|inner join|left join|join)\b/i.test(line)) {
            break; // stop when FROM or JOIN section starts
        }

        if (inSelect && line.length > 0) {
            // Remove trailing commas if present
            expressions.push(line.replace(/,$/, "").trim());
        }
    }

    return expressions;
};

const selectToColumn = (select: string) => {
    const match = select.match(/^(.*?)\s+AS\s+(.*)$/i);

    if (!match) {
        throw new Error(`medfetch: invalid SELECT expression: ${select}`);
    }

    let [_, path, alias] = match;
    let isCollection = false;
    path = path.trim();
    alias = alias.trim();

    if (alias) { // can only set a path to be a collection if you alias it!
        isCollection = /\[\]$/.test(alias);
        if (isCollection) {
            alias = alias.replace(/\[\]$/, '').trim(); // remove the trailing []
        }
    } else {
        const defaultName = extractDefaultAlias(path);
        if (!defaultName) {
            throw new Error(`medfetch: couldn't find a default path name for path ${path}. either prefix the path with a valid non function path segment or alias it (easiest!)`);
        }
        alias = defaultName;
    }

    return View.columnPath({
        name: alias,
        type: "string", // until we figure out if the type here is really necessary
        path,
        collection: isCollection,
        tags: []
    });
};

const buildSelect = (tables: TableReference[], columnPaths: View.ColumnPath[]) => {
    if (tables.length === 0) {
        throw new Error(`medfetch: unexpected empty table references list...`);
    }
    const [from, ...fieldJoins] = tables;
    if (from.joinType !== "from") {
        throw new Error(`medfetch: the first table reference was not a from but instead a ${from.joinType}!`)
    }
    const joinAliasMap = fieldJoins.reduce((acc, join) => {
        if (join.joinType === "from") {
            throw new Error(`Only 1 FROM statement is allowed but found multiple...`);
        }

        if (join.joinType === "left") {
            acc[join.alias] = View.ForEach({
                forEach: join.path,
                select: []
            })
        } else {
            acc[join.alias] = View.ForEachOrNull({
                forEachOrNull: join.path,
                select: []
            });
        }
        return acc;
    }, {} as Record<string, View.ForEach | View.ForEachOrNull>);

    const select: View.ViewDefinition["select"] = [View.Column({ column: [] })];

    return columnPaths.reduce((acc, columnPath) => {
        const hd = columnPath.path.split(".")[0];
        if (!hd) {
            throw new Error("Invalid empty string path...");
        }
        if (!joinAliasMap[hd] && acc[0]._tag === "Column") { // the second condition should always be true
            const appended = Arrayh.append(acc[0].column, columnPath);
            const newColumn = { ...acc[0], column: appended };
            return [newColumn, ...acc.slice(1)] as View.ViewDefinition["select"];
        }
        if (joinAliasMap[hd]) {
            const parent = joinAliasMap[hd];
            if (parent._tag === "ForEach") {
                const joinIndex = acc.findIndex((nd) => nd._tag === "ForEach" && nd.forEach === parent.forEach);
                if (joinIndex === -1) {
                    return Arrayh.append(acc, View.ForEach({
                        forEach: parent.forEach,
                        select: [
                            View.Column({
                                column: [columnPath]
                            })
                        ]
                    }));
                } else {
                    const forEach: View.ForEach = acc[joinIndex] as View.ForEach;
                    if (forEach.select.length === 0 || forEach.select[0]._tag !== "Column") {
                        throw new Error();
                    }
                    const appended = Arrayh.append(forEach.select[0].column, columnPath);
                    const newForEach = { ...forEach, select: Arrayh.replace(0, appended)(forEach.select) };
                    return [...acc.slice(0, joinIndex), newForEach, ...acc.slice(joinIndex + 1)] as any;
                }
            } else {
                const joinIndex = acc.findIndex((nd) => nd._tag === "ForEachOrNull" && nd.forEachOrNull === parent.forEachOrNull);
                if (joinIndex === -1) {
                    return Arrayh.append(acc, View.ForEachOrNull({
                        forEachOrNull: parent.forEachOrNull,
                        select: [
                            View.Column({
                                column: [columnPath]
                            })
                        ]
                    }));
                } else {
                    const forEachOrNull: View.ForEachOrNull = acc[joinIndex] as View.ForEachOrNull;
                    if (forEachOrNull.select.length === 0 || forEachOrNull.select[0]._tag !== "Column") {
                        throw new Error();
                    }
                    const appended = Arrayh.append(forEachOrNull.select[0].column, columnPath);
                    const newForEachOrNull = { ...forEachOrNull, select: Arrayh.replace(0, appended)(forEachOrNull.select) };
                    return [...acc.slice(0, joinIndex), newForEachOrNull, ...acc.slice(joinIndex + 1) ] as any;
                }
            }
        }

        return acc;
    }, select);
}

export function queryToViewDefinition(vtabName: string, query: string) {
    const columnPaths = extractSelectExpressions(query).map(selectToColumn);
    const tables = extractTables(query);
    const select = buildSelect(tables, columnPaths);

    return View.make({
        status: "active",
        resource: tables[0].path as ResourceType,
        name: vtabName,
        select,
        constant: [],
        where: []
    })
}

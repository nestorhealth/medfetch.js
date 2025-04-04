import { Array as Arrayh, pipe, Record } from "effect";
import { tableMigration, } from "./sqlite";
import { sof } from "./sof";
import Database from "better-sqlite3";
import { getFetchPath } from "./sqlite";
/**
 * Returns a new sqlite3 database extended with the
 * fetch vtable extension.
 *
 * @param fetchPath - path to the binary, defaults to the prebuilt one inside `bin`
 * @returns the extended better-sqlite3 database instance with the fetch extension
 */
export function medfetch(file, options, fetchPath = getFetchPath()) {
    const db = new Database(file, options);
    db.loadExtension(fetchPath); // default to the included binaries
    return db;
}
export async function _medfetch(baseUrl, { db, viewDefinitions }) {
    const resources = Object.keys(viewDefinitions);
    const defined = Arrayh.reduce(resources, {}, (acc, resourceType) => {
        if (viewDefinitions[resourceType]) {
            acc[resourceType] = viewDefinitions[resourceType];
        }
        return acc;
    });
    const migrations = pipe(defined, Record.values, Arrayh.map((viewDefinition) => tableMigration(viewDefinition)), Arrayh.join("\n"));
    // Set up in memory db
    db.exec(migrations);
    for (const resourceType of resources) {
        const bundle = (await fetch(`${baseUrl}/${resourceType}`, { headers: { Connection: "close" } }).then((res) => res.json()));
        const entries = bundle.entry.map((entry) => entry.resource);
        const rowified = sof(viewDefinitions[resourceType], entries);
        if (rowified.length === 0)
            continue;
        const tableName = defined[resourceType].name;
        const columnNames = Object.keys(rowified[0])
            .map((col) => `"${col}"`)
            .join(",");
        const placeholders = Object.keys(rowified[0])
            .map(() => "?")
            .join(",");
        const insert = db.prepare(`INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`);
        const transaction = db.transaction((rows) => {
            rows.forEach((row) => {
                const sqlized = Object.values(row).map((value) => {
                    if (value === null) {
                        return null;
                    }
                    else if (typeof value === "boolean") {
                        return value ? 1 : 0;
                    }
                    else {
                        return Arrayh.isArray(value) ||
                            typeof value === "object"
                            ? JSON.stringify(value)
                            : value;
                    }
                });
                insert.run(...sqlized);
            });
        });
        transaction(rowified);
    }
    return db;
}

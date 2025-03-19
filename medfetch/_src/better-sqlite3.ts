import { fhirR4 } from "@smile-cdr/fhirts";
import { View } from "./schema";
import { Array as Arrayh, pipe, Record } from "effect";
import {
    tableMigration,
} from "./sqlite";
import { rows } from "./sof";
import type { Database as BetterSqlite3Database } from "better-sqlite3";
import Database from "better-sqlite3";
import { getFetchPath } from "./sqlite";

/**
 * Returns a new sqlite3 database extended with the 
 * fetch vtable extension.
 *
 * @param fetchPath - path to the binary, defaults to the prebuilt one inside `bin`
 * @returns the extended better-sqlite3 database instance with the fetch extension
 */
export function medfetch(
    file?: string | Buffer,
    options?: Database.Options,
    fetchPath = getFetchPath(),
): BetterSqlite3Database {
    const db = new Database(file, options);
    db.loadExtension(fetchPath); // default to the included binaries
    return db;
}

type SofConfig = {
    db: BetterSqlite3Database;
    viewDefinitions: Record<string, View.ViewDefinition>;
};

export async function _medfetch(
    baseUrl: string,
    { db, viewDefinitions }: SofConfig,
): Promise<BetterSqlite3Database> {
    const resources = Object.keys(viewDefinitions);
    const defined = Arrayh.reduce(
        resources,
        {} as Record<string, View.ViewDefinition>,
        (acc, resourceType) => {
            if (viewDefinitions[resourceType]) {
                acc[resourceType] = viewDefinitions[resourceType];
            }
            return acc;
        },
    );

    const migrations = pipe(
        defined,
        Record.values,
        Arrayh.map((viewDefinition) => tableMigration(viewDefinition)),
        Arrayh.join("\n"),
    );
    // Set up in memory db
    db.exec(migrations);

    for (const resourceType of resources) {
        const bundle: fhirR4.Bundle = (await fetch(
            `${baseUrl}/${resourceType}`,
            { headers: { Connection: "close" } },
        ).then((res) => res.json())) as fhirR4.Bundle;
        const entries = bundle.entry!.map((entry) => entry.resource!);
        const rowified = rows(viewDefinitions[resourceType], entries);
        if (rowified.length === 0) continue;

        const tableName = defined[resourceType].name;
        const columnNames = Object.keys(rowified[0])
            .map((col) => `"${col}"`)
            .join(",");
        const placeholders = Object.keys(rowified[0])
            .map(() => "?")
            .join(",");

        const insert = db.prepare(
            `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`,
        );
        const transaction = db.transaction((rows: any[]) => {
            rows.forEach((row) => {
                const sqlized = Object.values(row).map((value) => {
                    if (value === null) {
                        return null;
                    } else if (typeof value === "boolean") {
                        return value ? 1 : 0;
                    } else {
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

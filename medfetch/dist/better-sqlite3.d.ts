import { View } from "./schema";
import type { Database as BetterSqlite3Database } from "better-sqlite3";
import Database from "better-sqlite3";
/**
 * Returns a new sqlite3 database extended with the
 * fetch vtable extension.
 *
 * @param fetchPath - path to the binary, defaults to the prebuilt one inside `bin`
 * @returns the extended better-sqlite3 database instance with the fetch extension
 */
export declare function medfetch(file?: string | Buffer, options?: Database.Options, fetchPath?: string): BetterSqlite3Database;
type SofConfig = {
    db: BetterSqlite3Database;
    viewDefinitions: Record<string, View.ViewDefinition>;
};
export declare function _medfetch(baseUrl: string, { db, viewDefinitions }: SofConfig): Promise<BetterSqlite3Database>;
export {};

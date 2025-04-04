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

import { type Dialect, Kysely } from "kysely";

export function medfetch<DB = any>(baseURL: string | File, {
    dialect,
}: {
    dialect: Dialect
}): Kysely<DB> {
    const db = new Kysely<DB>({
        dialect
    });
    return db;
}
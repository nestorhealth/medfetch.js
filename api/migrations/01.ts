import { sql, type Kysely } from "kysely";
import { readFileSync } from "node:fs";
import { vfsTypes } from "~/lib/types";

export async function up<T>(db: Kysely<T>): Promise<void> {
  const authMigrationText = readFileSync(
    new URL("./00.sql", import.meta.url) as unknown as string,
    "utf8",
  );
  await sql.raw(authMigrationText).execute(db);
  await db.schema
    .createType("vfs_type")
    .asEnum([vfsTypes.enum.kvfs, vfsTypes.enum.opfs])
    .execute();
  await db.schema
    .createTable("workspaces")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("user_id", "text", (col) => col.notNull().references("user.id"))
    .addColumn("vfs_type", sql`vfs_type`, col => col.notNull().defaultTo("opfs"))
    .addUniqueConstraint("unq_user_workspace_name", ["name", "user_id"])
    .execute();
}

export async function down<T>(db: Kysely<T>): Promise<void> {
  await db.schema.dropTable("workspaces").ifExists().execute();
  await db.schema.dropType("vfs_type").ifExists().execute();
  await db.schema.dropTable("verification").ifExists().execute();
  await db.schema.dropTable("account").ifExists().execute();
  await db.schema.dropTable("session").ifExists().execute();
  await db.schema.dropTable("user").ifExists().execute();
}

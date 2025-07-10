import {
  FileMigrationProvider,
  Migrator,
} from "kysely";
import { promises as fs } from "node:fs";
import { db } from "./db";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const migrator = new Migrator({
  db: db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, "../migrations"),
  }),
});

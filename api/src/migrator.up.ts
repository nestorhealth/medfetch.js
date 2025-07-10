import { db } from "./db";
import { migrator } from "~/migrator.client";

const { error, results } = await migrator.migrateToLatest();

if (results?.length === 0) {
  console.log("[medfetch-api/migrator] > nothing to migrate, early exiting now");
  process.exit(0);
}

results?.forEach((it) => {
  if (it.status === "Success") {
    console.log(
      `[medfetch-api/migrator] > migration "${it.migrationName}" was executed successfully`
    );
  } else if (it.status === "Error") {
    console.error(
      `[medfetch-api/migrator] > failed to execute migration "${it.migrationName}"`
    );
  }
});

if (error) {
  console.error("[medfetch-api/migrator] > failed to migrate");
  console.error(error);
  process.exit(1);
}

await db.destroy();

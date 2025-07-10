import { migrator } from "./migrator.client";

const result = await migrator.migrateDown();
if (result.error) {
  console.error(`[medfetch/migrator] > migrate down error occurred: ${result.error}`);
  process.exit(1);
} else {
  console.log(`[medfetch/migrator] > migrate down succeeded: ${JSON.stringify(result.results, null, 2)}`)
  process.exit(0);
}
import { Kysely } from "kysely";
import { sqliteOnFhir } from "~/sqlite.browser";

const dialect = sqliteOnFhir<{
}>(
    ":memory:",
    "https://r4.smarthealthit.org",
);

const db = new Kysely<typeof dialect.$db>({
    dialect,
});

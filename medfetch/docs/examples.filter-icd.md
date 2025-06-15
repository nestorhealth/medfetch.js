<script setup lang="ts">
import { table0, table1 } from "./sql/icd-queries";
import { onMounted, ref } from "vue";
import DataTable from "./components/DataTable.vue";
// @ts-ignore
import { sqliteOnFhir } from "~/sqlite.browser";
// @ts-ignore
import DBWorker from "./sql/db.worker?worker";
import { Kysely } from "kysely";

const worker = new DBWorker({ name: "db.worker" });

const dialect = sqliteOnFhir(
  ":memory:",
  "http://localhost:8787/fhir",
  ["Patient", "Condition"],
  worker,
);
const db = new Kysely({
  dialect,
});

type Column = {
  name: string;
  dataType: string;
};
type ViewState = { rows: Record<string, unknown>[]; columns: Column[] }

const viewStates = ref<ViewState[]>([]);
onMounted(async () => {
  try {
    const t0  = await table0(db);
    const t1 = await table1(db)
    const views: ViewState[] = [
      t0,
      t1
    ];
    console.log("ok", views[1])
    viewStates.value = views
  } catch (e) {
    console.error(e);
  }
});

</script>

# ICD Code Query example
This is what we'll start with:
- JS
```ts
  const initial = db
    .selectFrom("Patient")
    .innerJoin("Condition", "Condition.subject", "Patient.id")
    .select([
      "Patient.id as patient_id",
      sql<string>`strftime('%Y', "Condition"."onsetDateTime")`.as("onset_year"),
      sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'code'`.as("icd_code"),
      sql<string>`"Patient"."name" -> 0 -> 'given' ->> 0`.as("first_name"),
      sql<string>`"Patient"."name" -> 0 ->> 'family'`.as("last_name"),
      sql<string>`
      CAST(
        (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
        - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
          AS INTEGER
      )
      `.as("age")
    ]);

  await db.schema.createTable("patients").as(initial).execute();
  rows.value = await db.selectFrom("patients").selectAll().execute();
```

- Result
<ClientOnly>
    <DataTable :columns="viewStates[0].columns" :rows="viewStates[0].rows" />
</ClientOnly>

This uses the ICD code system but the same logic should apply for most others.

## General Inclusion
"Show me pediatric patients under 18 years old admitted in the US after 2015 with 
tibial shaft fractures."

- JS
```ts
const pediatricPatients = db
  .selectFrom("Patient")
  .selectAll("Patient")
  .where("Patient.age", "<" 18)
```
- Result
<ClientOnly>
  <DataTable :columns="viewStates[1].columns" :rows="viewStates[1].rows" />
</ClientOnly>

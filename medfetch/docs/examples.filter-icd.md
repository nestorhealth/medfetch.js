<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Kysely, sql } from "kysely";
import { sqliteOnFhir } from "~/sqlite.browser";
import SqliteWorker from "~/sqlite-wasm.thread?worker";
import DataTable from "./components/DataTable.vue";

type Column = {
  name: string;
  dataType: string;
};

const worker = new SqliteWorker({ name: "sqlite-wasm.thread" });
const dialect = sqliteOnFhir(":memory:", "http://localhost:8787/fhir", [
  "Patient",
  "Condition"
], worker);
type patients_initial = {
  patient_id: string;
  onset_year: string;
  icd_code: string;
  first_name: string;
  last_name: string;
  age: string;
}

type ViewState = { rows: Record<string, unknown>[]; columns: Column[] }

const db = new Kysely<typeof dialect.$db & { patients: patients_initial }>({ dialect });
const viewStates = ref<ViewState[]>([]);
onMounted(async () => {
  try {
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
          (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
          - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
        `.as("age")
      ]);

    await db.schema.createTable("patients").as(initial).execute();

    const patientTable = (await db.introspection.getTables()).find(t => t.name === "patients")!;

    const rowState = await db.selectFrom("patients").selectAll("patients").execute();
    const columnState = patientTable.columns.map(col => ({
      name: col.name,
      dataType: col.dataType
    }))

    
    const views: ViewState[] = [
      {
        rows: rowState,
        columns: columnState
      }
    ];
    
    const generalInclusion = await db
      .selectFrom("patients")
      .selectAll("patients")
      .where("icd_code", "like", "S82.%")
      .execute();
    views.push({
      rows: generalInclusion,
      columns: columnState
    });
    console.log("uh", generalInclusion)
    
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
        (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
        - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
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

<ClientOnly>
<pre>{{ viewStates }}</pre>
  <DataTable :columns="viewStates[0].columns" :rows="viewStates[0].rows" />
</ClientOnly>

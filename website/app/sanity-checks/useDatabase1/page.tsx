"use client";

import type { Kysely } from "kysely";
import type { Patient } from "fhir/r5";

import medfetch from "medfetch/sqlite-wasm";
import { useDatabase } from "medfetch/next";
import type { Rowify } from "medfetch/sql";
import { unzipJSONSchema } from "@/lib/json-schema";

export default function Page() {
  const dialect = medfetch(`${process.env.NEXT_PUBLIC_API_URL!}/fhir`, unzipJSONSchema);
  
  // #region useDatabase-usage
  const patientsQuery = useDatabase(
    dialect,
    async (db: Kysely<{ Patient: Rowify<Patient> }>) =>
      {
        const patients =  await db
          .selectFrom("Patient")
          .selectAll("Patient")
          .execute()
          .then((patients) =>
            // Databases store JSON objects as plaintext...
            patients.map((p) => ({ ...p, name: JSON.parse(p.name!) }))
          );
        return patients;
      },
    ["useDatabase1"]
  );
  // #endregion useDatabase-usage
  if (!patientsQuery.queryData) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {patientsQuery.queryData.map((patient) => (
        <div key={patient.id}>
          <p>First name: {patient.name[0].given}</p>
        </div>
      ))}
    </main>
  );
}

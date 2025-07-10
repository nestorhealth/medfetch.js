"use client";

import type { Kysely } from "kysely";
import type { Patient } from "fhir/r5";

import medfetch from "medfetch/sqlite-wasm";
import { useDatabase } from "medfetch/next";
import type { Rowify } from "medfetch/sql";
import { unzipJSONSchema } from "@/lib/json-schema";

export default function Page() {
  const dialect = medfetch(`${process.env.NEXT_PUBLIC_API_URL!}/fhir`, unzipJSONSchema);
  const patientsView = useDatabase(
    dialect,
    async (db: Kysely<{ Patient: Rowify<Patient> }>) =>
      {
        const patient =  await db
          .selectFrom("Patient")
          .selectAll("Patient")
          .execute()
          .then((patients) =>
            // Remember, databases store JSON objects as plaintext,
            // so we need to parse it ourselves
            patients.map((p) => ({ ...p, name: JSON.parse(p.name!) }))
          );
        console.log(patient);
        return patient;
      },
  );
  if (!patientsView.queryData) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {patientsView.queryData.map((patient) => (
        <div key={patient.id}>
          <p>First name: {patient.name[0].given}</p>
        </div>
      ))}
    </main>
  );
}

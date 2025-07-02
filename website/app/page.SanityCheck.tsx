"use client";

import { mockPatientBundleFile } from "@/app/mock-file";
import { api, authClient } from "@/lib/api";
import { open } from "@/lib/client";
import { Kysely, sql } from "kysely";
import medfetch from "medfetch/sqlite-wasm";
import { useEffect } from "react";
import { toast } from "sonner";

async function logCheckResult() {
  const session = await authClient.getSession();
  if (session.data) {
    toast.success(`You are authenticated.`);
  } else {
    toast.error(`You should sign-in`);
  }
  const workspace = await api
    .GET("/workspaces/{id}", {
      params: {
        path: {
          id: 2,
        },
      },
    })
    .catch(() => {
      toast.warning(`Pinging workspace again...`);
      return api.GET("/workspaces/{id}", {
        params: {
          path: {
            id: 2,
          },
        },
      });
    });
  if (!workspace.data) {
    return toast.error(`Unable to fetch workspace:${workspace.error.error}`);
  }
  const db = await open(workspace.data.name);
  const tables = await db.introspection.getTables();
  const hasPatientsTable = tables.some((table) => table.name === "patients");
  if (!hasPatientsTable) {
    console.warn(
      'No such patients table in OPFS file "foo". Inserting vtab Patients now. You shouldn\'t see me again unless you wipe your opfs data',
    );
    await sql
      .raw(`create table "patients" as select * from "Patient";`)
      .execute(db);
  } else {
    console.log('[sanity-check] > Persistence of "patients" table OK!');
  }
  const patientsCached = await sql.raw("select * from patients").execute(db);
  console.log("SAVED PATIENTS", patientsCached.rows);
  toast.success(
    `Successfully cached ${patientsCached.rows.length} custom-schema patients.`,
  );
}

export default function SanityCheck() {
  useEffect(() => {
    async function foo() {
      const dialect = medfetch(":memory:", mockPatientBundleFile, {
        scope: ["Patient"]
      });
      const db = new Kysely<any>({
        dialect
      });
      const result = await db.selectFrom("Patient").selectAll("Patient").execute();
      console.log("GOT", result)
    }
    foo();
  }, []);
  return null;
}

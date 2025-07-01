"use client";

import { useMedDB } from "@/lib/client";
import { useEffect } from "react";

export default function SanityCheck() {
  const db = useMedDB("foo");
  useEffect(() => {
    async function logCheckResult() {
      const tables = await db.introspection.getTables();
      console.log("Saved tables", tables.map(table => table.name));
      const hasPatientsTable = tables.some(table => table.name === "patients");
      if (!hasPatientsTable) {
        console.warn("No such patients table in OPFS file \"foo\". Inserting vtab Patients now. You shouldn't see me again unless you wipe your opfs data");
        await db.exec(`create table "patients" as select * from "Patient";`);
      } else {
        console.log("Persistence of \"patients\" table OK!");
      }
      const patientsCached = await db.prepare("select * from patients").all();
      console.log("SAVED PATIENTS", patientsCached)
    }
    logCheckResult();
  }, [db]);
  return null;
}
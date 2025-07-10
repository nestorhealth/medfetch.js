"use client";

import { Input } from "@/components/ui/input";
import { unzipJSONSchema } from "@/lib/json-schema";
import { useDatabase } from "medfetch/next";
import medfetch from "medfetch/sqlite-wasm";
import { useState } from "react";

const emptyFile = new File(
  [
    new Blob([
      JSON.stringify({
        resourceType: "Bundle",
        entry: [],
      }),
    ]),
  ],
  "lol",
);

export default function FileUploadCheck() {
  const [file, setFile] = useState<File>(emptyFile);
  const dialect = medfetch(file, unzipJSONSchema);
  const databaseState = useDatabase(dialect, async db => {
    const result = await db
      .selectFrom("Patient")
      .selectAll()
      .execute();
    return result;
  }, ["fileUploadCheck", file.name]);

  return (
    <>
      <Input
        type="file"
        onChange={(e) => {
          const uploadedFile = e.target.files?.[0];
          if (uploadedFile) {
            setFile(uploadedFile);
          }
        }}
      />
      {file && <p>Selected file: {file.name}</p>}
      {databaseState.queryData && (
        <p>{databaseState.queryData.length} Rows found</p>
      )}
      {databaseState.queryData && (
        (databaseState.queryData as any[]).map(
          (row: {id: string;}) => (
            <div key={row.id}>
              <p>Patient id: {row.id}</p>
            </div>
          )
        )
      )}
    </>
  );
}

"use client";

import { ow, sql } from "sqliteow";
import { useMutation } from "@tanstack/react-query";
import { Button } from "nextra/components";
import { Table } from "nextra/components";

// TODO - implement limit on medfetch() function itself
const SQL = sql<{
  id: string;
  name: string;
  birthDate: string;
}>`SELECT 
   json ->> 'id' AS id,
   json -> 'given' ->> 0 AS name,
   json ->> 'birthDate' AS birthDate
   FROM medfetch('Patient', json_array(
     'id',
     'name.given.first()',
     'birthDate'
   ))
   LIMIT 5;`;

export function RunExample() {
  const handle = ow();

  const { data, mutate, isPending } = useMutation({
    mutationFn: async () => {
      await handle("open");
      await handle("ow-load-module", {
        moduleURL: "/dist/medfetch.vtab.js",
        moduleName: "medfetch",
        loaderAux: ["/dist/fetch.worker.js"],
        aux: new TextEncoder().encode("https://r4.smarthealthit.org/")
      });
      return await handle.session(SQL).then((rows) => rows.toArray())
    },
    onError: (e) => console.error(e)
  });

  return (
    <div className="mt-4">
      <Button onClick={() => mutate()} disabled={isPending}>
        {isPending ? "Running..." : "Run"}
      </Button>

      {data && (
        <Table>
          <thead>
            <Table.Tr>
              <Table.Th>id</Table.Th>
              <Table.Th>name</Table.Th>
              <Table.Th>birthDate</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <Table.Tr key={idx}>
                <Table.Td className="px-2 py-1 border-b">{row.id}</Table.Td>
                <Table.Td className="px-2 py-1 border-b">{row.name}</Table.Td>
                <Table.Td className="px-2 py-1 border-b">{row.birthDate}</Table.Td>
              </Table.Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}


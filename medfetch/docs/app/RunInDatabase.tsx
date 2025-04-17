"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { medfetch } from "medfetch/sqlite";
import { Effect } from "effect";

export interface Row1 {
  id: string;
  gender: "male" | "female" | "unknown";
  first_name: string;
  last_name: string;
  birth_date: string;
  city: string;
  state: string;
}

const sql = medfetch("https://r4.smarthealthit.org/");
const SQL = sql<Row1>`
SELECT 
  json ->> 'id' AS id,
  json ->> 'gender' AS gender,
  json -> 'given' ->> 0 AS first_name,
  json -> 'family' ->> 0 AS last_name,
  json ->> 'birthDate' AS birth_date,
  json -> 'city' ->> 0 AS city,
  json -> 'state' ->> 0 AS state
FROM medfetch('Patient', json_array(
  'id',
  'gender',
  'name.given.first()',
  'name.family.first()',
  'birthDate',
  'address.city.first()',
  'address.state.last()'
))
LIMIT 5;`
export function RunInDatabase({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function start() {
      const o = console.log(await SQL.pipe(Effect.runPromise));
      console.log("here", o);
    }
    start();
  })
  const { data, mutate, isPending } = useMutation({
    onError: (e) => console.error(e),
  });

  return (
    <>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span>Click the run button to see it in action!</span>
        <Button
          onClick={() => mutate()}
          disabled={isPending}
          className="cursor-pointer"
        >
          Run
        </Button>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <div className="flex-1 w-full">{children}</div>
        <div className="flex-1 w-full overflow-x-auto min-h[200px] basis-full">
        </div>
      </div>
    </>
  );
}

"use client";

import { useMutation } from "@tanstack/react-query";
import medfetch from "medfetch/browser";
import { ow, sql } from "sqliteow";
import { Button } from "@/components/ui/button";
import { DataTable } from "./DataTable";

export interface Row1 {
    id: string;
    name: string;
    birth_date: string;
}
const SQL = sql<Row1>`SELECT 
   json ->> 'id' AS id,
   json -> 'given' ->> 0 AS name,
   json ->> 'birthDate' AS birth_date
   FROM medfetch('Patient', json_array(
     'id',
     'name.given.first()',
     'birthDate'
   ))
   LIMIT 5;`;

export function RunExampleWrapper({ children }: { children: React.ReactNode }) {
    const handle = ow();

    const { data, mutate, isPending } = useMutation({
        mutationFn: async () => {
            await handle("open");
            await handle(
                "ow-load-module",
                medfetch("https://r4.smarthealthit.org/"),
            );
            return await handle.session(SQL).then((rows) => rows.toArray());
        },
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
                <div className="w-full">{children}</div>
                <div className="w-full">
                    <DataTable data={data} isPending={isPending} />
                </div>
            </div>
        </>
    );
}

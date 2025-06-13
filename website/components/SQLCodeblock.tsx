"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { ArrowUpDown } from "lucide-react";
import { db } from "@/lib/client";
import { sql } from "kysely";

type Props = {
  children: React.ReactNode;
  mode?: "auth" | "public";
  columns?: string[];
  dropTables?: string[];
};

export function SQLCodeblock({ children, columns, dropTables }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  const [sqlText, setSqlText] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current) {
      const code = ref.current.querySelector("code");
      if (code) {
        setSqlText(code.textContent?.trim() || null);
      }
    }
  }, []);

  const { data, mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (sqlText) {
        const result = (await db.executeQuery(sql.raw(sqlText).compile(db))).rows;
        return result;
      }
    },
    onError: (e) => console.error(`medfetch-docs error: ${JSON.stringify(e, null, 2)}`),
    onSuccess: (data) =>
      console.log(`medfetch-docs sof result ok: size ${data?.length}`),
    onSettled: async () => {
      if (dropTables && dropTables.length > 0) {
        for (const query of dropTables.map((table) => sql`drop table if exists${table};`)) {
          await query;
        }
      }
    }
  });

  return (
    <div>
      <pre
        ref={ref}
        className="relative overflow-auto rounded"
      >
        {children}

        {sqlText && (
          <Button
            onClick={() => mutate()}
            className="absolute bottom-2 right-2 z-10 px-2 py-1 text-xs bg-white/10 text-white hover:bg-white/20 border border-white/20"
            variant="secondary"
            disabled={isPending}
          >
            Run
          </Button>
        )}
      </pre>

      <Separator className="my-6" />

      {isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      ) : (
          <DataTable
            data={data ?? [] as any[]}
            columns={columns?.map((columnName) => ({
              accessorKey: columnName,
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  {columnName}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              )
            })) ?? [
                {
                  accessorKey: "id",
                  header: "id"
                },
                {
                  accessorKey: "json",
                  header: "json"
                }
              ]}
          />
        )}
    </div>
  );
}


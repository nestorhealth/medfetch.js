"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/sqlite-wasm"; // assumed imports
import { sql } from "kysely";
interface Props {
  children: React.ReactNode;
  columns?: string[];
  dropTables?: string[];
  compiled: string;
}

export function TSCodeblock({ children, columns, compiled }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  const [tsText, setTsText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current) {
      const code = ref.current.querySelector("code");
      if (code) {
        setTsText(code.textContent?.trim() || null);
      }
    }
  }, []);

  const { data, mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!tsText) return [];

      // Replace with your own in-scope function for demo
      const result = await sql.raw(compiled).execute(db);
      return result;
    },
    onError: (e) => {
      const message =
        e instanceof Error ? e.message : JSON.stringify(e, null, 2);
      setError(message);
      console.error("medfetch-docs ts error:", message);
    },
    onSuccess: (data) => {
      console.log(`medfetch-docs ts result ok: size ${data?.length}`);
    },
  });

  return (
    <div>
      <pre ref={ref} className="relative overflow-auto rounded bg-neutral-900 text-white p-4">
        {children}
        {tsText && (
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

      {error && (
        <div className="text-red-500 font-mono text-sm mb-4 whitespace-pre-wrap">
          {error}
        </div>
      )}

      {isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      ) : (
        <DataTable
          data={data ?? []}
          columns={
            columns?.map((columnName) => ({
              accessorKey: columnName,
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {columnName}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
            })) ?? [
              { accessorKey: "id", header: "id" },
              { accessorKey: "json", header: "json" },
            ]
          }
        />
      )}
    </div>
  );
}
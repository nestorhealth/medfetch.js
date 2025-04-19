"use client";

import { useEffect, useRef, useState } from "react";
import { medfetch } from "medfetch/sqlite-wasm";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Effect } from "effect";
import { DataTable } from "./DataTable";

const sql = medfetch("https://r4.smarthealthit.org");

type Props = {
  children: React.ReactNode;
  columns?: string[];
};

export function SQLCodeblock({ children, columns }: Props) {
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
        return await sql<any>`${sqlText}`.pipe(Effect.runPromise);
      }
    }
  });

  return (
    <div>
      <pre ref={ref}>{children}</pre>
      {sqlText && (
        <Button
          className="mt-2 border px-3 py-1 rounded cursor-pointer"
          onClick={() => mutate()}
        >
          Run
        </Button>
      )}
      <DataTable
        data={data}
        columns={columns ?? ["id", "json"]}
        isPending={isPending}
      />
    </div>
  );
}

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
        const result = await sql<any>`${sqlText}`.pipe(Effect.runPromise);
        return result;
      }
    },
    onError: (e) => console.error(`medfetch-docs error: ${e}`),
    onSuccess: (data) =>
      console.log(`medfetch-docs sof result ok: size ${data?.length}`),
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
          >
            Run
          </Button>
        )}
      </pre>

      <DataTable
        data={data}
        columns={columns ?? ["id", "json"]}
        isPending={isPending}
      />
    </div>
  );
}


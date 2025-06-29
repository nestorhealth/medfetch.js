"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children as any}
    </QueryClientProvider>
  );
}

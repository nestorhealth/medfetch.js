"use client";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children as any}
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

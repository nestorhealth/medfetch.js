"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TEST_CASES = [
  { slug: "useDatabase1", label: "useDatabase readonly Query" },
  { slug: "useDatabase2", label: "useDatabase with Mutation"}
];

export default function SanityLayout(props: { children: ReactNode }) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").pop();

  return (
    <main className="max-w-4xl p-6 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sanity Checks Page</h1>
      </div>

      <Tabs value={currentSlug} className="w-full">
        <TabsList>
          {TEST_CASES.map(({ slug, label }) => (
            <TabsTrigger key={slug} value={slug} asChild>
              <Link href={`/sanity-checks/${slug}`}>{label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section className="p-6 border shadow-sm rounded-xl bg-muted/50">
        {props.children}
      </section>
    </main>
  );
}

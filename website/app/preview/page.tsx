"use client";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function PreviewPage() {
  const { data, isPending } = useQuery({
    queryKey: ["/fhir/Patient"],
    queryFn: () => api.GET("/fhir/Patient"),
  });

  return (
    <main className="mx-auto">
      <h1>This is the preview page</h1>
      <p>{isPending ? "Loading..." : "OK"}</p>
      <div>
        {data?.data?.entry?.map((patientEntry: any) => (
          <div key={patientEntry.resource.id}>{patientEntry.resource.id}</div>
        ))}
      </div>
    </main>
  );
}

import { strFromU8, unzipSync } from "fflate/node";
import { resolveRefs } from "json-refs";
import { jsonSchemaToZod } from "json-schema-to-zod";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Step 1: Load + unzip
async function loadFHIRSchema(): Promise<any> {
  const res = await fetch("https://build.fhir.org/fhir.schema.json.zip");
  const zip = unzipSync(new Uint8Array(await res.arrayBuffer()));
  const raw = zip["fhir.schema.json"];
  if (!raw) throw new Error("Schema not found in zip");
  return JSON.parse(strFromU8(raw));
}

// Step 2: Resolve $refs using json-refs
async function dereferenceSchema(schema: any): Promise<any> {
  const { resolved } = await resolveRefs(schema, {
    filter: ['relative', 'remote'],
    resolveCirculars: true, // handles circular refs gracefully
  });
  return resolved;
}

// Step 3: Convert to Zod
async function main() {
  const rawSchema = await loadFHIRSchema();
  const deref = await dereferenceSchema(rawSchema);

  const bundle = deref.definitions["Bundle"];
  if (!bundle) throw new Error("Bundle not found in schema");

  const zodCode = jsonSchemaToZod(bundle, {
    module: "esm",
    name: "Bundle",
  });

  const outPath = fileURLToPath(new URL("../dist/zod-fhir/Bundle.ts", import.meta.url) as any);
  fs.writeFileSync(outPath, zodCode, "utf8");
  console.log("✅ Generated Zod schema from resolved Bundle");
}

main().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});

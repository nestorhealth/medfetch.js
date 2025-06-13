#!/usr/bin/env node

import { Command } from "commander";
import { resolveRefs } from "json-refs";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { unzipJSONSchema } from "medfetch/json";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const program = new Command();

const out = (filename: string) =>
  fileURLToPath(new URL(`../dist/zod-fhir/${filename}`, import.meta.url) as any);

// -- Utility: resolve $refs
async function dereferenceSchema(schema: any): Promise<any> {
  const { resolved } = await resolveRefs(schema, {
    filter: ["relative", "remote"],
    resolveCirculars: true,
  });
  return resolved;
}

// -- Utility: get all resource types
function resourceTypeSet(rawSchema: any) {
  return (rawSchema["definitions"]["ResourceList"]["oneOf"] as { $ref: string }[]).map(
    (r) => r.$ref.split("/").pop()!
  );
}

// -- Write the generic "Resource" base schema
function writeGenericResourceSchema(rawSchema: any) {
  const resourceTypes = resourceTypeSet(rawSchema).map((r) => `"${r}"`);
  const text = `import { z } from "zod";
export const Resource = z.object({
  id: z.string(),
  resourceType: z.enum([${resourceTypes.join(", ")}])
});
export type Resource = z.infer<typeof Resource>;`;

  fs.mkdirSync(path.dirname(out("Resource.ts")), { recursive: true });
  fs.writeFileSync(out("Resource.ts"), text, "utf8");
  console.log(`✅ Wrote out generic resource schema to ${out("Resource.ts")}`);
}

// -- Generate a Zod schema for a single resource
function resourceSchema(resourceType: string, derefed: any) {
  const resource = derefed.definitions[resourceType];
  if (!resource) {
    throw new Error(`Resource not found in schema: ${resourceType}`);
  }

  const zodCode = jsonSchemaToZod(resource, {
    module: "esm",
    name: resourceType,
  });

  return `${zodCode};\nexport type ${resourceType} = z.infer<typeof ${resourceType}>;`;
}

// -- Main CLI entry point
async function main(resourceList: string[]) {
  const rawSchema = await unzipJSONSchema();
  writeGenericResourceSchema(rawSchema);

  const deref = await dereferenceSchema(rawSchema);

  for (const resource of resourceList) {
    try {
      const text = resourceSchema(resource, deref);
      fs.writeFileSync(out(`${resource}.ts`), text, "utf8");
      console.log(`✅ Generated Zod schema for ${resource}`);
    } catch (err) {
      console.error(`❌ Failed to generate ${resource}:`, err);
    }
  }
}

// -- Commander CLI setup
program
  .name("zod-fhir-gen")
  .description("Generate Zod schemas from FHIR JSON Schema")
  .argument("<resources...>", "FHIR resource types to convert (e.g., Patient Observation)")
  .action((resources) => {
    main(resources).catch((err) => {
      console.error("❌ Fatal error:", err);
      process.exit(1);
    });
  });

program.parse();

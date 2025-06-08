import { resolveRefs } from "json-refs";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { unzipJSONSchema } from "medfetch/sql";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const out = (filename: string) => fileURLToPath(
  new URL(`../dist/zod-fhir/${filename}`, import.meta.url) as any
);

// Step 2: Resolve $refs using json-refs
async function dereferenceSchema(schema: any): Promise<any> {
  const { resolved } = await resolveRefs(schema, {
    filter: ['relative', 'remote'],
    resolveCirculars: true, // handles circular refs gracefully
  });
  return resolved;
}

// Get the resource type literal enum set
function resourceTypeSet(rawSchema: any) {
  return (rawSchema["definitions"]["ResourceList"]["oneOf"] as { $ref: string; }[]).map(
    (resource) => resource.$ref.split("/").pop()!
  )
}

function writeGenericResourceSchema(rawSchema: any) {
  const resourceTypes = resourceTypeSet(rawSchema).map(
    (resource) => `"${resource}"`
  )
  const resourceSchemaText = 
  `import { z } from "zod";
  export const Resource = z.object({
    id: z.string(),
    resourceType: z.enum([${resourceTypes.toString()}])
  });
  export type Resource = z.infer<typeof Resource>;
  `;
  fs.mkdirSync(new URL("../dist/zod-fhir", import.meta.url) as any, { recursive: true })
  fs.writeFileSync(out("Resource.ts"), resourceSchemaText, "utf8");
  console.log(`✅ Wrote out generic resource schema to ${out("Resource.ts")}`);
}

function resourceSchema(resourceType: string, derefed: any) {
  const resource = derefed.definitions[resourceType];
  if (!resource) {
    throw new Error(`That doesn't exist: ${resource}`);
  }
  
  const zodCode = jsonSchemaToZod(resource, {
    module: "esm",
    name: resourceType
  });

  return zodCode + ";\n" + `export type ${resourceType} = z.infer<typeof ${resourceType}>`;
}

// Step 3: Convert to Zod
async function main(...resources: string[]) {
  const rawSchema = await unzipJSONSchema();
  writeGenericResourceSchema(rawSchema);
  
  const deref = await dereferenceSchema(rawSchema);
  resources.forEach(
    (resource) => {
      const text = resourceSchema(resource, deref);
      fs.writeFileSync(
        out(`${resource}.ts`),
        text,
        "utf8"
      );
      console.log(`✅ Generated Zod schema from resolved ${resource}`);
    }
  )
}

main("Bundle", "Patient", "Condition").catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});

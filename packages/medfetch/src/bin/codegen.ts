#!/usr/bin/env tsx
import fs from "fs";
import { unzipJSONSchema } from "../json.js"; // your existing util
import type { JSONSchema7 } from "json-schema";
import inquirer from "inquirer";

// Utility
function cleanPrimitive(t: string): string {
  if (t === "System.String") return "string";
  return t;
}

function extractResource(path: string): string {
  return path.split(".")[0];
}

function resolveType(schema: any): string | undefined {
  if (typeof schema !== "object" || !schema) return undefined;
  if (typeof schema.type === "string") return schema.type;
  if (Array.isArray(schema.type)) return schema.type[0];
  if (typeof schema.$ref === "string") return schema.$ref.split("/").pop();
  return undefined;
}

function extractPathMapFromJSONSchema(schema: JSONSchema7): Record<string, string> {
  const out: Record<string, string> = {};
  if (!schema.definitions || typeof schema.definitions !== "object") {
    throw new Error("Invalid schema: missing definitions");
  }

  for (const [defKey, defVal] of Object.entries(schema.definitions)) {
    const def = defVal as JSONSchema7;
    if (!def.properties || typeof def.properties !== "object") continue;

    for (const [field, propSchema] of Object.entries(def.properties)) {
      const typeStr = resolveType(propSchema);
      if (typeStr) {
        out[`${defKey}.${field}`] = typeStr;
      }
    }
  }

  return out;
}

// ---- Main Execution ----

const DEFAULT_FHIR_SCHEMA_ZIP = "https://build.fhir.org/fhir.schema.json.zip";
import path from "path";
import { fileURLToPath } from "url";

// Get current file location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default output location depends on script path
let defaultOutputPath: string;
if (__dirname.includes("/out")) {
  defaultOutputPath = path.resolve("dist/types.d.ts");
} else {
  defaultOutputPath = path.resolve("src/types.d.ts");
}

// Parse args
const [,, inputPathOrUrlRaw, outputPathArg] = process.argv;

const inputPathOrUrl = inputPathOrUrlRaw && !inputPathOrUrlRaw.endsWith(".ts")
  ? inputPathOrUrlRaw
  : DEFAULT_FHIR_SCHEMA_ZIP;

const outputPath = outputPathArg ?? defaultOutputPath;

if (!inputPathOrUrl) {
  console.error("❌ Usage: npx medfetch codegen <local.json|fhir.zip-url>");
  process.exit(1);
}

let pathMap: Record<string, string>;

if (/^https?:\/\//.test(inputPathOrUrl)) {
  console.log("🌐 Downloading schema...");
  const schema = await unzipJSONSchema(inputPathOrUrl, "fhir.schema.json");
  pathMap = extractPathMapFromJSONSchema(schema);
} else {
  pathMap = JSON.parse(fs.readFileSync(inputPathOrUrl, "utf-8"));
}

const allPaths = Object.keys(pathMap);
const allResources = Array.from(new Set(allPaths.map(extractResource))).sort();

console.log(`✅ Loaded ${allResources.length} resources from schema.`);

// Prompt the user for comma-separated list
const { resourceInput } = await inquirer.prompt([
  {
    type: "input",
    name: "resourceInput",
    message: "Enter the resources to generate compile-time types for (comma-separated):"
  }
]);

// Parse and validate
const selectedRaw = resourceInput
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const selected = selectedRaw.filter((r: any) => allResources.includes(r));
const invalid = selectedRaw.filter((r: any) => !allResources.includes(r));

if (selected.length === 0) {
  console.error("❌ No valid resources selected.");
  console.log(`ℹ️ Available examples: ${allResources.slice(0, 10).join(", ")}`);
  process.exit(1);
}

if (invalid.length > 0) {
  console.warn(`⚠️ Ignored invalid resources: ${invalid.join(", ")}`);
}

const filteredEntries = Object.entries(pathMap)
  .filter(([key]) => !key.includes("_") && selected.some((resource: any) => key.startsWith(`${resource}.`)))
  .map(([path, type]) => `  "${path}": "${cleanPrimitive(type)}",`);

if (filteredEntries.length === 0) {
  console.warn("⚠️ No matching paths found.");
  process.exit(0);
}

const output = `// Auto-generated. Do not edit manually.
export type PathType = {
${filteredEntries.join("\n")}
};
`;

fs.writeFileSync(outputPath, output);
console.log(`✅ "type PathType" written to ${outputPath} with ${filteredEntries.length} entries.`);

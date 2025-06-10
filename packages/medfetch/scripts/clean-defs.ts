import { writeFileSync, readFileSync } from "node:fs";
import { Array, Option, Tuple, Record, pipe } from "effect";
import { fhirR4 } from "@smile-cdr/fhirts";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filepath = fileURLToPath(import.meta.url);
const __dirname = dirname(__filepath);
const definitionsPath = resolve(
    __dirname,
    "../definitions/profiles-resources.json",
);

const BASE_RESOURCES: fhirR4.Bundle = pipe(
    readFileSync(definitionsPath, "utf8"),
    JSON.parse,
);

const snapshotMap = (bundle: fhirR4.Bundle) => {
    return pipe(
        bundle
            .entry!.flatMap((entry) => entry.resource!)
            .filter(
                (resource) => resource.resourceType === "StructureDefinition",
            ),
        Array.filterMap((definition) =>
            definition.id !== undefined && definition.snapshot !== undefined
                ? Option.some(Tuple.make(definition.id, definition.snapshot))
                : Option.none(),
        ),
        Record.fromEntries,
    );
};

const map = snapshotMap(BASE_RESOURCES);

const rewritePath = resolve(__dirname, "../src/base-dependencies/base-map.ts");
const value = JSON.stringify(map, null, 2);
writeFileSync(
    rewritePath,
    `export const BASE_MAP: Record<string, any> = ${value};`,
    "utf8",
);

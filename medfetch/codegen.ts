import fhirpath_r4_model from "fhirpath/fhir-context/r4";
import { writeFileSync } from "node:fs";
import { hd, length, split } from "./src/path";
import { FhirType } from "./src/fhir-type";

const path2Type = fhirpath_r4_model["path2Type"];

const typeValues = Object.values(path2Type);
const pathKeys = new Set(Object.keys(path2Type).map((path) => hd(path)));
const fhirTypes = new Set(FhirType);
const difference = pathKeys.difference(fhirTypes).values().toArray();

const typeDeclaration = (type: string) =>
    `export type ${type} = ${Array(new Set(typeValues))
        .map((typeName) => `"${typeName}"`)
        .join(" | ")};`;
const constArrayDeclaration: (type: string) => (arr: string[]) => string =
    (constArrName) => (arr) =>
        `export const ${constArrName} = [\n${arr.map((key) => `"${key}"`).join(",\n")}\n] as const;\n\nexport type ${constArrName} = typeof ${constArrName}[number]`;

const value = constArrayDeclaration("ResourceType");
writeFileSync("./src/resource-types.ts", value(difference));

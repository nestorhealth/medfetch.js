import r4 from "fhirpath/fhir-context/r4";
import fs from "node:fs";

const set = new Set<string>();
const keys = Object.keys(r4.path2Type).map((path) => path.split(".")[0]).filter((key) => {
    if (key[0].toLowerCase() == key[0]) {
        return false;
    }
    if (set.has(key)) {
        return false;
    } else {
        set.add(key);
        return true;
    }
}).map((key) => `"${key}"`);

fs.writeFileSync("resource-list.txt", keys.join(",\n"));

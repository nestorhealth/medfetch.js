import { parseStringPromise } from "xml2js";
import { unzipSync } from "fflate";
import { TextDecoder } from "node:util";
import fs from "node:fs/promises";

async function extractICDCodesFromZip(outPath: string) {
  const res = await fetch(
    "https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/ICD10CM/2024/icd10cm-Table%20and%20Index-2024.zip"
  );

  if (!res.ok) throw new Error(`Failed to fetch ZIP: ${res.statusText}`);
  const zipBuf = new Uint8Array(await res.arrayBuffer());
  const zipEntries = unzipSync(zipBuf);

  // Find the XML file in the zip
  const targetKey = Object.keys(zipEntries).find((key) => {
    return key === "icd10cm-tabular-2024.xml"
  });
  if (!targetKey) {
    throw new Error(`Couldn't find the expected table.`)
  }


  const xmlStr = new TextDecoder().decode(zipEntries[targetKey]);
  const result = await parseStringPromise(xmlStr);

  const codeMap: Record<string, any> = {};

  const chapters = result["ICD10CM.tabular"].chapter;

  for (const chapter of chapters) {
    for (const section of chapter.section ?? []) {
      for (const diag of section.diag ?? []) {
        traverseDiag(diag, codeMap);
      }
    }
  }

  await fs.writeFile(outPath, JSON.stringify(codeMap, null, 2), "utf8");
  console.log(`✅ Extracted ${Object.keys(codeMap).length} codes`);
}

function traverseDiag(diag: any, map: Record<string, { system: string; code: string; display?: string; }>) {
  const code = diag.name?.[0];
  const desc = diag.desc?.[0];
  if (code) {
    map[code] = {
      system: "http://hl7.org/fhir/ValueSet/icd-10",
      code: code,
    };
    if (desc) {
      map[code].display = desc;
    }
  }

  for (const sub of diag.diag ?? []) {
    traverseDiag(sub, map);
  }
}

extractICDCodesFromZip("icd10cm.json");

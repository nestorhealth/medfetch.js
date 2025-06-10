import { Command } from "commander";
import { generateConditions } from "./researcher-demo/generate-conditions";
import path from "path";
import fs from "fs";
import { generatePatients } from "./researcher-demo/generate-patients";
import { fileURLToPath } from "url";

const program = new Command();

function writeFile(resourceType: string, data: any[]) {
    const outputURL = new URL(`../public/researcher-demo/${resourceType}.json`, import.meta.url);
    const outputPath = fileURLToPath(outputURL as any);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✅ Wrote ${data.length} fake ${resourceType} to ${outputPath}`);
}

program
  .name("researcher-demo")
  .description("Generate mock FHIR data for the researcher demo")
  .argument("<n>", "How many Patients to generate")
  .action((n, options) => {
    const count = parseInt(n);
    if (isNaN(count) || count <= 0) {
      console.error(
        "❌ Please provide a positive integer for number of Conditions."
      );
      process.exit(1);
    }
    const patients = generatePatients(n);
    const conditions = generateConditions(patients.map(p => p.id));
    writeFile("Patient", patients);
    writeFile("Condition", conditions)
  });
  
program.parse();

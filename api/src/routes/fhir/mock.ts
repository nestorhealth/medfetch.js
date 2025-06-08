import { Bundle } from "+/zod-fhir/Bundle";
import { Condition } from "+/zod-fhir/Condition";
import { Patient } from "+/zod-fhir/Patient";
import { faker } from "@faker-js/faker";
import { sqliteMigrations } from "medfetch/sql";
import z from "zod";

type MapValues<RecordLike, V> = {
  [Key in keyof RecordLike]: V;
};

const ICD = {
  "S82.20": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.20",
    display: "Unspecified fracture of shaft of tibia",
  },
  "S82.201": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.201",
    display: "Unspecified fracture of shaft of right tibia",
  },
  "S82.202": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.202",
    display: "Unspecified fracture of shaft of left tibia",
  },
  "S82.209": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.209",
    display: "Unspecified fracture of shaft of unspecified tibia",
  },
  "S82.22": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.22",
    display: "Transverse fracture of shaft of tibia",
  },
  "S82.221": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.221",
    display: "Displaced transverse fracture of shaft of right tibia",
  },
  "S82.222": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.222",
    display: "Displaced transverse fracture of shaft of left tibia",
  },
  "S82.223": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.223",
    display: "Displaced transverse fracture of shaft of unspecified tibia",
  },
  "S82.224": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.224",
    display: "Nondisplaced transverse fracture of shaft of right tibia",
  },
  "S82.225": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.225",
    display: "Nondisplaced transverse fracture of shaft of left tibia",
  },
  "S82.226": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.226",
    display: "Nondisplaced transverse fracture of shaft of unspecified tibia",
  },
  "S82.23": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.23",
    display: "Oblique fracture of shaft of tibia",
  },
  "S82.231": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.231",
    display: "Displaced oblique fracture of shaft of right tibia",
  },
  "S82.232": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.232",
    display: "Displaced oblique fracture of shaft of left tibia",
  },
  "S82.233": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.233",
    display: "Displaced oblique fracture of shaft of unspecified tibia",
  },
  "S82.234": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.234",
    display: "Nondisplaced oblique fracture of shaft of right tibia",
  },
  "S82.235": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.235",
    display: "Nondisplaced oblique fracture of shaft of left tibia",
  },
  "S82.236": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.236",
    display: "Nondisplaced oblique fracture of shaft of unspecified tibia",
  },
  "S82.24": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.24",
    display: "Spiral fracture of shaft of tibia",
  },
  "S82.241": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.241",
    display: "Displaced spiral fracture of shaft of right tibia",
  },
  "S82.242": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.242",
    display: "Displaced spiral fracture of shaft of left tibia",
  },
  "S82.243": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.243",
    display: "Displaced spiral fracture of shaft of unspecified tibia",
  },
  "S82.244": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.244",
    display: "Nondisplaced spiral fracture of shaft of right tibia",
  },
  "S82.245": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.245",
    display: "Nondisplaced spiral fracture of shaft of left tibia",
  },
  "S82.246": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.246",
    display: "Nondisplaced spiral fracture of shaft of unspecified tibia",
  },
  "S82.25": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.25",
    display: "Comminuted fracture of shaft of tibia",
  },
  "S82.251": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.251",
    display: "Displaced comminuted fracture of shaft of right tibia",
  },
  "S82.252": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.252",
    display: "Displaced comminuted fracture of shaft of left tibia",
  },
  "S82.253": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.253",
    display: "Displaced comminuted fracture of shaft of unspecified tibia",
  },
  "S82.254": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.254",
    display: "Nondisplaced comminuted fracture of shaft of right tibia",
  },
  "S82.255": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.255",
    display: "Nondisplaced comminuted fracture of shaft of left tibia",
  },
  "S82.256": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.256",
    display: "Nondisplaced comminuted fracture of shaft of unspecified tibia",
  },
  "S82.26": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.26",
    display: "Segmental fracture of shaft of tibia",
  },
  "S82.261": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.261",
    display: "Displaced segmental fracture of shaft of right tibia",
  },
  "S82.262": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.262",
    display: "Displaced segmental fracture of shaft of left tibia",
  },
  "S82.263": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.263",
    display: "Displaced segmental fracture of shaft of unspecified tibia",
  },
  "S82.264": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.264",
    display: "Nondisplaced segmental fracture of shaft of right tibia",
  },
  "S82.265": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.265",
    display: "Nondisplaced segmental fracture of shaft of left tibia",
  },
  "S82.266": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.266",
    display: "Nondisplaced segmental fracture of shaft of unspecified tibia",
  },
  "S82.29": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.29",
    display: "Other fracture of shaft of tibia",
  },
  "S82.291": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.291",
    display: "Other fracture of shaft of right tibia",
  },
  "S82.292": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.292",
    display: "Other fracture of shaft of left tibia",
  },
  "S82.299": {
    system: "http://hl7.org/fhir/ValueSet/icd-10",
    code: "S82.299",
    display: "Other fracture of shaft of unspecified tibia",
  },
};

function makeFactory<T extends z.ZodObject<any>, Output = z.infer<T>>(
  schema: T
): (overrides: Partial<MapValues<Output, () => any>>) => Output {
  const shape = schema.shape;

  return (overrides: Partial<MapValues<Output, () => any>> = {}) => {
    const result: any = {};

    for (const key in shape) {
      if (key.startsWith("_")) continue;

      const def = shape[key] as z.ZodTypeAny;

      if (overrides[key as keyof Output]) {
        result[key] = overrides[key as keyof Output]!();
      } else {
        // Garbage defaults
        if (def instanceof z.ZodBoolean) result[key] = false;
        else if (def instanceof z.ZodNumber) result[key] = faker.number.int();
        else if (def instanceof z.ZodString || def instanceof z.ZodLiteral)
          result[key] = faker.lorem.word();
        else if (def instanceof z.ZodArray) result[key] = [faker.lorem.word()];
        else result[key] = faker.lorem.words(2);
      }
    }

    return result;
  };
}

// Constructor functions that return random mock values for each field based on zod schema
export const bundle = makeFactory(Bundle);
export const patient = makeFactory(Patient);
export const condition = makeFactory(Condition);

// Set of all fkeyable ids
const FAKE_PATIENT_IDS = ["p1", "p2"];

// Override condition constructor with a random ICD code
const randomConditions = Array(5)
  .fill(null)
  .map((_) =>
    condition({
      subject: () => Math.random() < 0.5 ? FAKE_PATIENT_IDS[0] : FAKE_PATIENT_IDS[1],
      code: () => {
        const entries = Object.entries(ICD);
        const randomIndex = Math.floor(Math.random() * entries.length);
        return entries[randomIndex][1];
      },
    })
  );
  
sqliteMigrations(["Condition"]).then(
  (condition_table) => {
    console.log("CONDITION SQL", condition_table.sql)
    randomConditions.forEach(
      (condition) => {
        console.log("CONDITION ID", condition.id)
        console.log("I am condition with subject", condition.subject);
        console.log("I am condition with code", condition.code);
      }
    )
  }
)

randomConditions.forEach(
  cond => console.log(cond.code)
);
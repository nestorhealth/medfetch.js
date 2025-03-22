import { describe, it } from "vitest";
import { Patient } from "./examples/view-definition";
import { medfetch } from "./better-sqlite3";
import Database from "better-sqlite3";

describe("better-sqlite3 : medfetch", () => {
    it(`Can attach to the r4 smarthealthit.org api`, async () => {
        const db = await medfetch("https://r4.smarthealthit.org", {
            db: new Database(":memory:"),
            viewDefinitions: {
                Patient: Patient.simple1,
            },
        });
        const result = db.prepare(`SELECT * FROM simple_patient1`).all();
        console.log("got all", result);
    });
});

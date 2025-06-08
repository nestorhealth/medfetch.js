import { sqliteMigrations } from "~/sql";

const initialState = await sqliteMigrations([
    "Patient",
    "Condition",
    "Procedure"
]);

const myResource = () => ({
    id: "lol",
    resourceType: Math.random() < 0.5 ? "Patient" : "Condition"
})

console.log("here", initialState.preprocess(myResource()));
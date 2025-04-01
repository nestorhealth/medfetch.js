import { performance } from "node:perf_hooks";
import fs from "fs";

const raw = fs.readFileSync("data.json", "utf8");
const obj = JSON.parse(raw);

const start = performance.now();
const jsonStr = JSON.stringify(obj);
const end = performance.now();

console.log(`Node stringify: ${(end - start).toFixed(3)}ms`);


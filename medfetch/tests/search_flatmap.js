import M from "./build/search_flatmap.js";

await M();
console.log("WASM Module Loaded");
console.log(`Heap Memory Used: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);


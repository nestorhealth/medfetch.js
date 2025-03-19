import wasm from "./build/darwin-x86_64/sqlite3.mjs";

const sqlite = await wasm();
const db = new sqlite.oo1.DB();

db.exec("CREATE VIRTUAL TABLE Patient USING MEDFETCH();");

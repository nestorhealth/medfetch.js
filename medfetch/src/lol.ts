import { sqliteowPromise } from "sqliteow";
// @ts-ignore
import path from "@sqlite.org/sqlite-wasm?url";

const ow = await sqliteowPromise(path);
const response = await ow("open");

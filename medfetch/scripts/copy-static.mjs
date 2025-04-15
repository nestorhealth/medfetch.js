// scripts/copy-medfetch-to-public.mjs
import { mkdir, cp, readdir } from "fs/promises";
import path from "node:path";

const USER_ROOT = process.env.INIT_CWD;

const MEDFETCH_DIST = path.join(USER_ROOT, "node_modules/medfetch/dist");
const BROWSER_DIST = path.join(MEDFETCH_DIST, "browser");

const SQLITEOW_PUBLIC_DIR = path.join(USER_ROOT, "public/sqliteow");
const VTAB_DIR = path.join(USER_ROOT, "public/sqliteow/vtab");


await mkdir(SQLITEOW_PUBLIC_DIR, { recursive: true });
await mkdir(VTAB_DIR, { recursive: true });

// Copy dist/*.mjs → public/sqliteow/
const distFiles = await readdir(MEDFETCH_DIST);
for (const file of distFiles) {
  if (file.endsWith(".mjs")) {
    await cp(
      path.join(MEDFETCH_DIST, file),
      path.join(SQLITEOW_PUBLIC_DIR, file)
    );
  }
}

// Copy dist/browser/*.mjs (excluding index.mjs) → public/sqliteow/vtab/
const browserFiles = await readdir(BROWSER_DIST);
for (const file of browserFiles) {
  if (file.endsWith(".mjs") && file !== "index.mjs") {
    await cp(
      path.join(BROWSER_DIST, file),
      path.join(VTAB_DIR, file)
    );
  }
}

console.log("✅ Copied medfetch .mjs files to public/sqliteow/");

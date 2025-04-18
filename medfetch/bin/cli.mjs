#!/usr/bin/env node
import { build } from "tsup";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import path from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

function findPackageRoot(resolvedPath) {
  let dir = path.dirname(resolvedPath);
  while (dir !== "/" && !fs.existsSync(path.join(dir, "package.json"))) {
    dir = path.dirname(dir);
  }
  return dir;
}

// Try resolving from user project and up through workspace
function resolveFromUp(dep, startDir) {
  let dir = startDir;

  while (dir !== "/") {
    try {
      const fullPath = require.resolve(dep, { paths: [dir] });
      return fullPath;
    } catch {
      // keep walking up
      dir = path.dirname(dir);
    }
  }

  throw new Error(`Could not resolve ${dep}`);
}

export async function resolveUserPeers({ failOnMissing = true } = {}) {
  const peerDependencies = {
    "effect": "^3.14.1",
    "fhirpath": "^3.17.0"
  };

  const aliasMap = {};
  const missing = [];

  const cwd = process.cwd();

  for (const dep of Object.keys(peerDependencies)) {
    try {
      const resolvedEntry = resolveFromUp(dep, cwd);
      const basePath = findPackageRoot(resolvedEntry);
      aliasMap[dep] = basePath;
      console.log(`✅ Resolved ${dep} to ${basePath}`);
    } catch {
      missing.push(dep);
    }
  }

  if (failOnMissing && missing.length > 0) {
    console.error("❌ Missing peer deps:\n", missing.join("\n"));
    process.exit(1);
  }

  return aliasMap;
}


const entryFile = resolve(__dirname, "../src/sqlite-wasm.vtab.ts");
const cmd = argv[2];

if (cmd === "bundle") {
    const userPeerAliases = await resolveUserPeers();

    const finalAliases = {
        "~": resolve(__dirname, "../src"),
        ...userPeerAliases
    };

    await build({
        entry: {
            "medfetch.vtab": entryFile
        },
        noExternal: ["effect", "fhirpath"],
        format: ["esm"],
        outDir: "public/sqlite-ext",
        target: "es2020",
        splitting: false,
        clean: false,
        dts: false,
        minify: true,
        esbuildOptions(options) {
            options.alias = finalAliases;
        }
    });

    console.log("medfetch: ✅ bundled extension to public/sqlite-ext/medfetch.vtab.mjs");
} else {
    console.error(
`medfetch: unknown command "${cmd}"
Usage:
    medfetch bundle -- Bundle medfetch virtual table into /public/sqlite-ext`
);
}


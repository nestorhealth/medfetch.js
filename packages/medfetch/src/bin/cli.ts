#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const [, , subcommand, ...args] = process.argv;

if (subcommand === "codegen") {
  const child = spawn("node", [join(__dirname, "codegen.js"), ...args], {
    stdio: "inherit"
  });

  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  console.log("Usage: npx medfetch <command>");
  console.log("Commands:");
  console.log("  codegen     Generate path-primitive types");
  process.exit(1);
}

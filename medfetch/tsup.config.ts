import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/bin/cli.ts", "src/bin/codegen.ts"],
  outDir: "out",
  format: ["esm"],                // or "cjs" if you want
  target: "node18",
  clean: true,
  splitting: false,
  dts: false,
  minify: false,
  sourcemap: false
});

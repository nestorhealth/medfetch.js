import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/block.ts"],
        outDir: "dist",
        format: ["esm"],
        splitting: false,
        dts: {
            entry: "src/block.ts"
        },
        clean: true,
        minify: false,
    }
]);

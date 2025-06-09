import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/block.browser.ts"],
        outDir: "dist",
        format: ["esm"],
        splitting: false,
        dts: false,
        clean: true,
        minify: false,
    },
    {
        entry: ["src/block.node.ts"],
        outDir: "dist",
        format: ["esm"],
        splitting: false,
        dts: {
            entry: "src/block.node.ts"
        },
        clean: false,
        minify: false,
    },
]);

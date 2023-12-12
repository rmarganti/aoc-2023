import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["./src/main.ts"],
    format: ["esm"],
    target: "node20",
    sourcemap: true,
    clean: true,
    noExternal: [/^@repo\/.*/],
});

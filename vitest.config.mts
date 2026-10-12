import { defineConfig } from "vitest/config";

// Unit tests cover pure functions only, so the default Node environment is enough.
export default defineConfig({
  resolve: { tsconfigPaths: true },
});

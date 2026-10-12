import { afterEach, type expect } from "bun:test";
// Side-effect import: registers jest-dom matchers on Bun's global `expect`.
import "@testing-library/jest-dom";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

declare module "bun:test" {
  interface Matchers<T>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}
}

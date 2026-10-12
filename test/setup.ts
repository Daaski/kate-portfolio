import { afterEach, expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);
afterEach(cleanup);

declare module "bun:test" {
  interface Matchers<T>
    extends matchers.TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}
}

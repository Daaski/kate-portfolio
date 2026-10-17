import { expect, test } from "vitest";
import { routes } from "./routes";

test("builds the project case address from its slug", () => {
  expect(routes.project("mcoffee")).toBe("/projects/mcoffee");
});

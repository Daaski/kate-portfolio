import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { ScrollProgress } from ".";

test("is hidden from screen readers", () => {
  const { container } = render(<ScrollProgress />);
  expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
});

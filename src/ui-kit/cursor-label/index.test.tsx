import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { CursorLabel } from ".";

function renderLink() {
  render(
    <CursorLabel label="Подробнее">
      <a href="/projects/sfera">Центр охраны труда</a>
    </CursorLabel>
  );
  return screen.getByRole("link", { name: "Центр охраны труда" });
}

test("marks the children with the label for the cursor", () => {
  const link = renderLink();
  expect(
    link.closest("[data-cursor-label]")?.getAttribute("data-cursor-label")
  ).toBe("Подробнее");
});

test("draws no label itself", () => {
  renderLink();
  expect(screen.queryByText("Подробнее")).toBeNull();
});

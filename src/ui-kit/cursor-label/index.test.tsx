import { fireEvent, render, screen } from "@testing-library/react";
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

test("shows no label until the mouse enters", () => {
  renderLink();
  expect(screen.queryByText("Подробнее")).toBeNull();
});

test("shows the label hidden from screen readers when the mouse enters", () => {
  const link = renderLink();
  fireEvent.pointerEnter(link, { pointerType: "mouse" });
  expect(screen.getByText("Подробнее").getAttribute("aria-hidden")).toBe(
    "true"
  );
  expect(
    screen.getByRole("link", { name: "Центр охраны труда" })
  ).toBeDefined();
});

test("shows no label on touch", () => {
  const link = renderLink();
  fireEvent.pointerEnter(link, { pointerType: "touch" });
  fireEvent.pointerMove(link, { pointerType: "touch" });
  expect(screen.queryByText("Подробнее")).toBeNull();
});

test("hides the label when the mouse leaves", () => {
  const link = renderLink();
  fireEvent.pointerEnter(link, { pointerType: "mouse" });
  fireEvent.pointerLeave(link, { pointerType: "mouse" });
  expect(screen.queryByText("Подробнее")).toBeNull();
});

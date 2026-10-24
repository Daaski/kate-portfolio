import { render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { GroupLabel } from ".";

afterEach(() => {
  vi.restoreAllMocks();
});

// jsdom не считает раскладку: верх секции берётся из data-top, лейбл — 96…140px, как при прилипании.
function renderAt(tops: [number, number]) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const top = Number(this.dataset.top ?? 96);
      return { bottom: top + 44, top } as DOMRect;
    }
  );
  render(
    <>
      <GroupLabel accent="blue" labels={["О проекте", "Результат"]} />
      <section data-group data-top={tops[0]} />
      <section data-group data-top={tops[1]} />
    </>
  );
}

test("shows the label of the group under it", () => {
  renderAt([-300, 500]);
  expect(screen.getByText("О проекте")).toBeDefined();
  expect(screen.queryByText("Результат")).toBeNull();
});

test("switches to the next group once its top passes the label middle", () => {
  renderAt([-900, 110]);
  expect(screen.getByText("Результат")).toBeDefined();
  expect(screen.queryByText("О проекте")).toBeNull();
});

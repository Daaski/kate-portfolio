import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { Follower } from ".";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

function renderCard() {
  render(
    <>
      <Follower />
      <div data-cursor-label="Подробнее">
        <a href="/projects/sfera">Центр охраны труда</a>
      </div>
    </>
  );
  return screen.getByRole("link", { name: "Центр охраны труда" });
}

test("shows no label until the mouse is over a card", () => {
  renderCard();
  expect(screen.queryByText("Подробнее")).toBeNull();
});

test("shows the label hidden from screen readers over a card", () => {
  const link = renderCard();
  fireEvent.pointerOver(link, { pointerType: "mouse" });
  expect(
    screen.getByText("Подробнее").closest("[aria-hidden='true']")
  ).not.toBeNull();
  expect(
    screen.getByRole("link", { name: "Центр охраны труда" })
  ).toBeDefined();
});

test("shows the label when the mouse first moves over a card", () => {
  const link = renderCard();
  fireEvent.pointerMove(link, { pointerType: "mouse" });
  expect(
    screen.getByText("Подробнее").closest("[aria-hidden='true']")
  ).not.toBeNull();
});

test("shows no label on touch", () => {
  const link = renderCard();
  fireEvent.pointerOver(link, { pointerType: "touch" });
  expect(screen.queryByText("Подробнее")).toBeNull();
});

test("hides the system cursor only while the dot is drawn", () => {
  const link = renderCard();
  expect(document.documentElement.dataset.cursor).toBeUndefined();
  fireEvent.pointerOver(link, { pointerType: "mouse" });
  expect(document.documentElement.dataset.cursor).toBeDefined();
  fireEvent.pointerOut(link, { pointerType: "mouse" });
  expect(document.documentElement.dataset.cursor).toBeUndefined();
});

// jsdom, как и часть браузеров, не шлёт pointerover, когда страница меняется под неподвижной мышью.
test("hides the label after navigating away from a card under a still mouse", async () => {
  const { rerender } = render(
    <>
      <Follower />
      <div data-cursor-label="Подробнее">
        <a href="/projects/sfera">Центр охраны труда</a>
      </div>
    </>
  );
  fireEvent.pointerMove(
    screen.getByRole("link", { name: "Центр охраны труда" }),
    { clientX: 10, clientY: 10, pointerType: "mouse" }
  );
  await waitFor(() =>
    expect(screen.getByText("Подробнее").style.transform).toBe("none")
  );

  navigation.pathname = "/projects/sfera";
  document.elementFromPoint = () => document.body;
  rerender(<Follower />);

  // Сам текст остаётся, чтобы плашка сжималась с ним: скрыта она масштабом.
  await waitFor(() =>
    expect(screen.getByText("Подробнее").style.transform).toBe("scale(0)")
  );
});

test("keeps the dot when a touch leaves the window", () => {
  const link = renderCard();
  fireEvent.pointerOver(link, { pointerType: "mouse" });
  fireEvent.pointerOut(link, { pointerType: "touch" });
  expect(document.documentElement.dataset.cursor).toBeDefined();
});

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { ProjectsCarousel } from ".";

const embla = vi.hoisted(() => {
  const handlers = new Map<string, () => void>();
  return {
    api: {
      off: vi.fn(),
      on: vi.fn((event: string, handler: () => void) => {
        handlers.set(event, handler);
      }),
      scrollTo: vi.fn(),
      selectedScrollSnap: vi.fn(() => 0),
    },
    handlers,
  };
});

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), embla.api],
}));
vi.mock("embla-carousel-wheel-gestures", () => ({
  WheelGesturesPlugin: () => ({}),
}));

beforeEach(() => {
  vi.clearAllMocks();
  embla.handlers.clear();
  embla.api.selectedScrollSnap.mockReturnValue(0);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
});

function renderCarousel() {
  return render(
    <ProjectsCarousel>
      <a href="/projects/a">Первый</a>
      <a href="/projects/b">Второй</a>
      <a href="/projects/c">Третий</a>
    </ProjectsCarousel>
  );
}

test("renders every slide inside the projects region", () => {
  renderCarousel();
  const region = screen.getByRole("region", { name: "Проекты" });
  expect(within(region).getAllByRole("link")).toHaveLength(3);
});

test("renders one indicator button per slide and marks the selected one", () => {
  renderCarousel();
  const buttons = screen.getAllByRole("button");
  expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
    "Проект 1 из 3",
    "Проект 2 из 3",
    "Проект 3 из 3",
  ]);
  expect(buttons.map((button) => button.getAttribute("aria-current"))).toEqual([
    "true",
    null,
    null,
  ]);
});

test("renders clickable aria-hidden copies of every slide out of the tab order", () => {
  const { container } = renderCarousel();
  expect(screen.getAllByRole("link", { hidden: true })).toHaveLength(6);
  expect(screen.getAllByRole("link")).toHaveLength(3);
  // inert блокирует и клик мышью — копии должны оставаться ссылками.
  expect(container.querySelector("[inert]")).toBeNull();
  const copies = container.querySelectorAll<HTMLElement>(
    "[aria-hidden='true'] a"
  );
  expect([...copies].map((link) => link.tabIndex)).toEqual([-1, -1, -1]);
});

test("keeps focus out of a copy when it is pressed", () => {
  const { container } = renderCarousel();
  const copy = container.querySelector("[aria-hidden='true'] a");
  // fireEvent возвращает false, если обработчик отменил действие по умолчанию — перенос фокуса.
  expect(copy && fireEvent.mouseDown(copy)).toBe(false);
});

test("scrolls to the nearest copy of the clicked project", () => {
  renderCarousel();
  fireEvent.click(screen.getByRole("button", { name: "Проект 3 из 3" }));
  expect(embla.api.scrollTo).toHaveBeenCalledWith(5, false);
});

test("marks the project of a copy slide as selected", () => {
  renderCarousel();
  embla.api.selectedScrollSnap.mockReturnValue(4);
  act(() => embla.handlers.get("select")?.());
  expect(
    screen
      .getByRole("button", { name: "Проект 2 из 3" })
      .getAttribute("aria-current")
  ).toBe("true");
});

test("jumps without animation when reduced motion is preferred", () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  renderCarousel();
  fireEvent.click(screen.getByRole("button", { name: "Проект 2 из 3" }));
  expect(embla.api.scrollTo).toHaveBeenCalledWith(1, true);
});

test("moves the selection when the carousel selects another slide", () => {
  renderCarousel();
  embla.api.selectedScrollSnap.mockReturnValue(1);
  act(() => embla.handlers.get("select")?.());
  expect(
    screen
      .getByRole("button", { name: "Проект 2 из 3" })
      .getAttribute("aria-current")
  ).toBe("true");
});

test("updates the selection after reInit", () => {
  renderCarousel();
  embla.api.selectedScrollSnap.mockReturnValue(2);
  act(() => embla.handlers.get("reInit")?.());
  expect(
    screen
      .getByRole("button", { name: "Проект 3 из 3" })
      .getAttribute("aria-current")
  ).toBe("true");
});

test("unsubscribes from the carousel on unmount", () => {
  const { unmount } = renderCarousel();
  const select = embla.handlers.get("select");
  const reInit = embla.handlers.get("reInit");
  unmount();
  expect(embla.api.off).toHaveBeenCalledWith("select", select);
  expect(embla.api.off).toHaveBeenCalledWith("reInit", reInit);
});

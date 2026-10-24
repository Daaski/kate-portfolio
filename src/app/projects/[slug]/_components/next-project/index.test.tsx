import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { NextProject } from ".";

// useRouter без смонтированного App Router падает — в jsdom его нет.
const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const PREVIEW = "Превью следующего кейса";

let frames: FrameRequestCallback[] = [];
let top = 0;
let buttonBottom = 0;

const scroll = (to: number) => {
  top = to;
  window.dispatchEvent(new Event("scroll"));
  for (const callback of frames.splice(0)) {
    callback(0);
  }
};

const stopAt = (bottom: number) => {
  buttonBottom = bottom;
  act(() => {
    window.dispatchEvent(new Event("scrollend"));
  });
};

// jsdom не считает раскладку: положение кнопки и зоны задаёт тест. line — окно превью целиком
// показалось (прогресс 0), end — низ зоны на низу экрана (прогресс 1).
function layout(viewport: number, zone: number, block: number) {
  vi.stubGlobal("innerHeight", viewport);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(block);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ bottom: buttonBottom, height: zone, top }) as DOMRect
  );
  top = viewport;
  return {
    end: viewport - zone,
    line: viewport - Math.min(block, zone / 2),
  };
}

function renderNextProject() {
  render(
    <NextProject href="/projects/sfera">
      <p>{PREVIEW}</p>
    </NextProject>
  );
}

beforeEach(() => {
  frames = [];
  buttonBottom = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    frames.push(callback)
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  router.push.mockClear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("links to the next project before the zone opens", () => {
  renderNextProject();
  expect(
    screen.getByRole("link", { name: "Следующий проект" }).getAttribute("href")
  ).toBe("/projects/sfera");
  expect(screen.queryByText(PREVIEW)).toBeNull();
});

test("keeps the zone closed when scrolling stops above the button", () => {
  layout(768, 1536, 476);
  renderNextProject();
  stopAt(800);
  expect(screen.queryByText(PREVIEW)).toBeNull();
});

test("opens the zone when scrolling stops at the button", () => {
  layout(768, 1536, 476);
  renderNextProject();
  stopAt(700);
  expect(screen.getByText(PREVIEW)).toBeDefined();
});

// Инерция, долетевшая до кнопки, дальше не едет: зоны ещё нет, переход не начинается.
test("does not navigate before the zone opens", () => {
  const { end } = layout(768, 1536, 476);
  renderNextProject();
  scroll(end);
  expect(router.push).not.toHaveBeenCalled();
});

test("navigates once when the user scrolls from the button to the end", () => {
  const { line, end } = layout(768, 1536, 476);
  renderNextProject();
  stopAt(700);
  scroll(line);
  scroll(end);
  scroll(end);
  expect(router.push).toHaveBeenCalledTimes(1);
  expect(router.push).toHaveBeenCalledWith("/projects/sfera");
});

test("does not navigate before the end of the zone", () => {
  const { line, end } = layout(768, 1536, 476);
  renderNextProject();
  stopAt(700);
  scroll(line);
  scroll(end + 40);
  expect(router.push).not.toHaveBeenCalled();
});

test("navigates in a viewport lower than the block", () => {
  const { line, end } = layout(300, 450, 476);
  renderNextProject();
  stopAt(280);
  scroll(line);
  scroll(end);
  expect(router.push).toHaveBeenCalledWith("/projects/sfera");
});

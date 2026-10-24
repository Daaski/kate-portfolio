import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { NextProject } from ".";

// useRouter без смонтированного App Router падает — в jsdom его нет.
const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

let frames: FrameRequestCallback[] = [];
let top = 0;

const scroll = (to: number) => {
  top = to;
  window.dispatchEvent(new Event("scroll"));
  for (const callback of frames.splice(0)) {
    callback(0);
  }
};

// jsdom не считает раскладку: положение зоны задаёт тест. start — зона под экраном (прогресс 0),
// end — низ зоны на низу экрана (прогресс 1).
function layout(viewport: number, zone: number, block: number) {
  vi.stubGlobal("innerHeight", viewport);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(block);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ height: zone, top }) as DOMRect
  );
  top = viewport;
  return { end: viewport - zone, start: viewport };
}

function renderNextProject() {
  render(
    <NextProject href="/projects/sfera">
      <p>Превью следующего кейса</p>
    </NextProject>
  );
}

beforeEach(() => {
  frames = [];
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

test("links to the next project and renders its preview", () => {
  renderNextProject();
  expect(
    screen.getByRole("link", { name: "Следующий проект" }).getAttribute("href")
  ).toBe("/projects/sfera");
  expect(screen.getByText("Превью следующего кейса")).toBeDefined();
});

test("does not navigate at the end of the zone without user input", () => {
  const { end } = layout(768, 1152, 476);
  renderNextProject();
  scroll(end);
  expect(router.push).not.toHaveBeenCalled();
});

// После «Назад» браузер восстанавливает прокрутку внизу уже после монтирования, а первый жест
// вверх трекпадом — пара пикселей, прогресс остаётся выше порога.
test("does not navigate on a small scroll up from the restored end", () => {
  const { end } = layout(768, 1152, 476);
  renderNextProject();
  scroll(end);
  window.dispatchEvent(new Event("wheel"));
  scroll(end + 4);
  expect(router.push).not.toHaveBeenCalled();
});

test("navigates once when the user scrolls to the end of the zone", () => {
  const { start, end } = layout(768, 1152, 476);
  renderNextProject();
  window.dispatchEvent(new Event("wheel"));
  scroll(start);
  scroll(end);
  scroll(end);
  expect(router.push).toHaveBeenCalledTimes(1);
  expect(router.push).toHaveBeenCalledWith("/projects/sfera");
});

test("navigates after scrolling up from the restored end and back down", () => {
  const { start, end } = layout(768, 1152, 476);
  renderNextProject();
  scroll(end);
  window.dispatchEvent(new Event("wheel"));
  scroll(start);
  scroll(end);
  expect(router.push).toHaveBeenCalledWith("/projects/sfera");
});

test("navigates in a viewport lower than the block", () => {
  const { end } = layout(300, 450, 476);
  renderNextProject();
  window.dispatchEvent(new Event("wheel"));
  scroll(end);
  expect(router.push).toHaveBeenCalledWith("/projects/sfera");
});

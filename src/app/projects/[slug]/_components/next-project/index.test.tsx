import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { LinkStub, morphName as nameOf } from "@/lib/test-utils";
import { nextProjectTypes } from "@/lib/view-transition";
import { NextProject } from ".";

// useRouter без смонтированного App Router падает — в jsdom его нет.
const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

// jsdom не рисует кадры: элементы motion запоминают цель доезда, конец анимации тест вызывает сам.
const motion = vi.hoisted(() => ({
  complete: undefined as (() => void) | undefined,
  fill: undefined as unknown,
  preview: undefined as unknown,
  reduced: false,
}));

interface MotionProps {
  animate?: unknown;
  onAnimationComplete?: () => void;
  transition?: unknown;
}

vi.mock("motion/react-m", () => ({
  div: ({
    animate,
    onAnimationComplete: _complete,
    transition: _transition,
    ...props
  }: ComponentProps<"div"> & MotionProps) => {
    if (animate) {
      motion.preview = animate;
    }
    return <div {...props} />;
  },
  span: ({
    animate,
    onAnimationComplete,
    transition: _transition,
    ...props
  }: ComponentProps<"span"> & MotionProps) => {
    if (animate) {
      motion.fill = animate;
      motion.complete = onAnimationComplete;
    }
    return <span {...props} />;
  },
}));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => motion.reduced,
}));

const PREVIEW = "Превью следующего кейса";

const NAVIGATION = [
  "/projects/sfera",
  { transitionTypes: nextProjectTypes },
] as const;

let frames: FrameRequestCallback[] = [];
let top = 0;
let buttonBottom = 0;

const scroll = (to: number) => {
  top = to;
  window.dispatchEvent(new Event("scroll"));
  act(() => {
    for (const callback of frames.splice(0)) {
      callback(0);
    }
  });
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
  const line = viewport - Math.min(block, zone / 2);
  const end = viewport - zone;
  return { end, line, middle: (line + end) / 2 };
}

function renderNextProject() {
  render(
    <NextProject slug="sfera">
      <p>{PREVIEW}</p>
    </NextProject>
  );
}

// Неперехваченный клик по ссылке ушёл бы в навигацию jsdom: слушатель на document запоминает,
// перехватил ли клик компонент, и гасит его сам.
function click(init?: MouseEventInit) {
  let prevented = false;
  document.addEventListener(
    "click",
    (event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    },
    { once: true }
  );
  fireEvent.click(screen.getByRole("link", { name: "Следующий проект" }), init);
  return prevented;
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
  motion.complete = undefined;
  motion.fill = undefined;
  motion.preview = undefined;
  motion.reduced = false;
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
  expect(router.push).toHaveBeenCalledWith(...NAVIGATION);
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
  expect(router.push).toHaveBeenCalledWith(...NAVIGATION);
});

test("finishes the progress before navigating on click", () => {
  const { line, middle } = layout(768, 1536, 476);
  renderNextProject();
  stopAt(700);
  scroll(line);
  scroll(middle);
  expect(click()).toBe(true);
  expect(router.push).not.toHaveBeenCalled();
  expect(motion.fill).toEqual({ "--fill": ["50%", "100%"] });
  expect(motion.preview).toEqual({ translate: ["0 50%", "0 0%"] });
  act(() => motion.complete?.());
  expect(router.push).toHaveBeenCalledTimes(1);
  expect(router.push).toHaveBeenCalledWith(...NAVIGATION);
});

test("fills from zero when clicked before the zone opens", () => {
  renderNextProject();
  click();
  expect(motion.fill).toEqual({ "--fill": ["0%", "100%"] });
});

// Клик до открытия зоны уже доезжает с нуля — превью со своей длительностью отстало бы от заливки.
test("keeps the zone closed when scrolling stops after a click", () => {
  layout(768, 1536, 476);
  renderNextProject();
  click();
  stopAt(700);
  expect(screen.queryByText(PREVIEW)).toBeNull();
});

test("navigates once on repeated clicks and scrolling during the finish", () => {
  const { line, middle, end } = layout(768, 1536, 476);
  renderNextProject();
  stopAt(700);
  scroll(line);
  scroll(middle);
  click();
  click();
  scroll(end);
  act(() => motion.complete?.());
  expect(router.push).toHaveBeenCalledTimes(1);
});

// Клик с модификатором — новая вкладка или окно браузера, текущая страница остаётся как есть.
test.each<MouseEventInit>([
  { metaKey: true },
  { ctrlKey: true },
  { shiftKey: true },
  { altKey: true },
  { button: 1 },
])("leaves the %o click to the browser", (init) => {
  renderNextProject();
  expect(click(init)).toBe(false);
  expect(motion.fill).toBeUndefined();
  expect(router.push).not.toHaveBeenCalled();
});

test("navigates at once with reduced motion", () => {
  motion.reduced = true;
  renderNextProject();
  expect(click()).toBe(true);
  expect(motion.fill).toBeUndefined();
  expect(router.push).toHaveBeenCalledWith(...NAVIGATION);
});

const morphName = () => nameOf(screen.getByText(PREVIEW));

// Имя морфа — прямо перед навигацией: во время доезда мини-карточка этого же проекта
// в «Других проектах» ещё может получить то же имя.
test("names the preview for the morph when the finish ends", () => {
  const { line, middle } = layout(768, 1536, 476);
  renderNextProject();
  stopAt(700);
  scroll(line);
  scroll(middle);
  click();
  expect(morphName()).toBeNull();
  act(() => motion.complete?.());
  expect(morphName()).toBe("project-sfera");
});

test("names the preview for the morph when scrolled to the end", () => {
  const { line, end } = layout(768, 1536, 476);
  renderNextProject();
  stopAt(700);
  scroll(line);
  expect(morphName()).toBeNull();
  scroll(end);
  expect(morphName()).toBe("project-sfera");
});

// Мини-карточка этого же проекта, нажатая во время заливки, уже увела навигацию и забрала имя морфа.
test("does not navigate or name the preview after another site link took over", () => {
  const { line, middle } = layout(768, 1536, 476);
  render(
    <>
      <NextProject slug="sfera">
        <p>{PREVIEW}</p>
      </NextProject>
      {/* Гасит клик, как next/link при навигации внутри сайта. */}
      <LinkStub href="/projects/sfera">Мини-карточка</LinkStub>
    </>
  );
  stopAt(700);
  scroll(line);
  scroll(middle);
  click();
  fireEvent.click(screen.getByRole("link", { name: "Мини-карточка" }));
  act(() => motion.complete?.());
  expect(router.push).not.toHaveBeenCalled();
  expect(morphName()).toBeNull();
});

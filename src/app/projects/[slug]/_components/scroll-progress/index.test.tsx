import { render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { ScrollProgress } from ".";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// jsdom не считает раскладку: низ кнопки относительно экрана задаёт тест.
function renderAt(scrollY: number, buttonBottom: number) {
  vi.stubGlobal("innerHeight", 800);
  vi.stubGlobal("scrollY", scrollY);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    bottom: buttonBottom,
  } as DOMRect);
  const { container } = render(
    <>
      <a data-scroll-progress-end="" href="/projects/sfera">
        Следующий проект
      </a>
      <ScrollProgress />
    </>
  );
  return container.querySelector<HTMLElement>("[aria-hidden]");
}

test("is hidden from screen readers", () => {
  const { container } = render(<ScrollProgress />);
  expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
});

// Зона под кнопкой дорастает позже — от высоты всей страницы полоса откатывалась бы назад.
test("counts the way from the top of the page to the button", () => {
  const bar = renderAt(600, 1000);
  expect(bar?.style.getPropertyValue("scale")).toBe("0.75 1");
});

test("stays full once the button is on screen", () => {
  const bar = renderAt(2000, 300);
  expect(bar?.style.getPropertyValue("scale")).toBe("1 1");
});

test("stays empty without the button", () => {
  const { container } = render(<ScrollProgress />);
  window.dispatchEvent(new Event("scroll"));
  expect(
    container
      .querySelector<HTMLElement>("[aria-hidden]")
      ?.style.getPropertyValue("scale")
  ).toBe("");
});

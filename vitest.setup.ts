import { cleanup } from "@testing-library/react";
import type { ViewTransitionProps } from "react";
import { afterEach, vi } from "vitest";

// Глобалы Vitest выключены, поэтому Testing Library не может сама зарегистрировать cleanup.
afterEach(cleanup);

// В jsdom нет ResizeObserver, а раскладку он всё равно не считает: заглушка, чтобы компоненты,
// которые следят за размером, рендерились.
globalThis.ResizeObserver = class {
  disconnect() {
    // заглушка
  }
  observe() {
    // заглушка
  }
  unobserve() {
    // заглушка
  }
};

// jsdom не рисует view transitions, а сам ViewTransition в DOM ничего не оставляет. Подмена на div
// с именем показывает тестам, кому выдано имя морфа: без имени атрибута нет.
vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();
  return {
    ...react,
    ViewTransition: ({ children, name }: ViewTransitionProps) =>
      react.createElement("div", { "data-view-transition": name }, children),
  };
});

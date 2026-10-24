import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

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

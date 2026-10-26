import { beforeEach, expect, test } from "vitest";
import { getCursorState } from "./utils";

beforeEach(() => {
  document.body.innerHTML = "";
});

function target(markup: string) {
  document.body.innerHTML = markup;
  return document.getElementById("target");
}

test("is a dot without a target", () => {
  expect(getCursorState(null)).toEqual({ kind: "dot" });
});

test("is a dot outside links and labels", () => {
  expect(getCursorState(target('<p id="target">Текст</p>'))).toEqual({
    kind: "dot",
  });
});

test("grows inside a link", () => {
  expect(
    getCursorState(target('<a href="/"><span id="target">Ссылка</span></a>'))
  ).toEqual({ kind: "link" });
});

test("grows inside a button", () => {
  expect(
    getCursorState(target('<button><span id="target">Кнопка</span></button>'))
  ).toEqual({ kind: "link" });
});

test("shows the label over a card even though the card is a link", () => {
  expect(
    getCursorState(
      target(
        '<div data-cursor-label="Подробнее"><a href="/"><span id="target">Карточка</span></a></div>'
      )
    )
  ).toEqual({ kind: "label", label: "Подробнее" });
});

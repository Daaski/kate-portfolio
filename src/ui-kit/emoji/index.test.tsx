import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Emoji } from ".";

test("renders the emoji image hidden from screen readers", () => {
  const { container } = render(
    <p>
      <Emoji name="diamond-blue" />
      Опрос в Telegram-канале
    </p>
  );
  expect(screen.queryByRole("img")).toBeNull();
  expect(container.querySelector("img")?.getAttribute("alt")).toBe(
    "Синий ромб"
  );
});

test("exposes the emoji to screen readers by its label", () => {
  render(
    <p>
      Сколько стоит <Emoji label="затем" name="arrow-right" /> Что я получу
    </p>
  );
  expect(screen.getByRole("img", { name: "затем" })).toBeDefined();
});

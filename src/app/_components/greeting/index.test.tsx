import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Greeting } from ".";

test("names Kate and her role in the level-one heading", () => {
  render(<Greeting />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Немова Екатерина UX/UI-дизайнер",
    })
  ).toBeDefined();
});

test("describes what Kate does under the heading", () => {
  render(<Greeting />);
  expect(
    screen.getByText(
      "Помогаю продуктам расти через понятный интерфейс, нахожу, где пользователи теряются, проверяю гипотезы и довожу решения до релиза. Работаю с B2B и B2C, web и mobile."
    )
  ).toBeDefined();
});

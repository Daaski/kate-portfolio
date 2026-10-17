import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Greeting } from ".";

test("greets with the level-one heading", () => {
  render(<Greeting />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Привет" })
  ).toBeDefined();
});

test("introduces Kate with the highlighted role", () => {
  render(<Greeting />);
  expect(
    screen.getByText("Екатерина, я UX/UI-дизайнер с опытом 2+ лет.")
  ).toBeDefined();
});

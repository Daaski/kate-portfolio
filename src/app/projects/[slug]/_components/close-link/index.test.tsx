import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { CloseLink } from ".";

test("leads home", () => {
  render(<CloseLink />);
  expect(
    screen.getByRole("link", { name: "На главную" }).getAttribute("href")
  ).toBe("/");
});

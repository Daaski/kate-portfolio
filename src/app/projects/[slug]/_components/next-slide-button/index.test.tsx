import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { NextSlideButton } from ".";

test("renders the next slide button", () => {
  render(<NextSlideButton />);
  expect(screen.getByRole("button", { name: "Следующий слайд" })).toBeDefined();
});

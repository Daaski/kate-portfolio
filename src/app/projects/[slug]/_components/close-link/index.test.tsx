import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { CloseLink } from ".";

vi.mock("next/link", async () => ({
  default: (await import("@/lib/test-utils")).LinkStub,
}));

test("leads home", () => {
  render(<CloseLink />);
  expect(
    screen.getByRole("link", { name: "На главную" }).getAttribute("href")
  ).toBe("/");
});

test("animates the way home as a site link navigation", () => {
  render(<CloseLink />);
  expect(
    screen
      .getByRole("link", { name: "На главную" })
      .getAttribute("data-transition-types")
  ).toBe("nav");
});

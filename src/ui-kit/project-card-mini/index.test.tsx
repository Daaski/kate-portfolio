import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { ProjectCardMini } from ".";

const props = {
  cover: {
    alt: "Экран приложения MCoffee",
    src: { height: 696, src: "/mcoffee.png", width: 320 },
  },
  href: "/projects/mcoffee",
  title: "Карта спешелти-кофеен",
};

test("links to the case page named by the title", () => {
  render(<ProjectCardMini {...props} />);
  const link = screen.getByRole("link", { name: "Карта спешелти-кофеен" });
  expect(link.getAttribute("href")).toBe("/projects/mcoffee");
  expect(
    within(link).getByRole("img", { name: "Экран приложения MCoffee" })
  ).toBeDefined();
});

test("loads the cover lazily", () => {
  render(<ProjectCardMini {...props} />);
  expect(
    screen
      .getByRole("img", { name: "Экран приложения MCoffee" })
      .getAttribute("loading")
  ).toBe("lazy");
});

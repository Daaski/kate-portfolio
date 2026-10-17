import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { ProjectCard } from ".";

const props = {
  cover: {
    alt: "Экран приложения MCoffee",
    src: { height: 696, src: "/mcoffee.png", width: 320 },
  },
  description: "Спроектировала сервис поиска спешелти-кофеен.",
  href: "/projects/mcoffee",
  sizes: "410px",
  tag: "Mobile-first",
  title: "Карта спешелти-кофеен",
};

test("makes the whole card a link to the case page named by the title", () => {
  render(<ProjectCard {...props} />);
  const link = screen.getByRole("link", { name: "Карта спешелти-кофеен" });
  expect(link.getAttribute("href")).toBe("/projects/mcoffee");
  expect(within(link).getByText("Mobile-first")).toBeDefined();
  expect(
    within(link).getByRole("img", { name: "Экран приложения MCoffee" })
  ).toBeDefined();
});

test("loads the cover lazily by default", () => {
  render(<ProjectCard {...props} />);
  const cover = screen.getByRole("img", { name: "Экран приложения MCoffee" });
  expect(cover.getAttribute("loading")).toBe("lazy");
  expect(cover.getAttribute("fetchpriority")).toBeNull();
});

test("loads the cover eagerly when eager", () => {
  render(<ProjectCard {...props} eager />);
  const cover = screen.getByRole("img", { name: "Экран приложения MCoffee" });
  expect(cover.getAttribute("loading")).toBe("eager");
});

test("describes the link with the description", () => {
  render(<ProjectCard {...props} />);
  const link = screen.getByRole("link", { name: "Карта спешелти-кофеен" });
  const descriptionId = link.getAttribute("aria-describedby") ?? "";
  expect(document.getElementById(descriptionId)?.textContent).toBe(
    "Спроектировала сервис поиска спешелти-кофеен."
  );
});

test("passes sizes to the cover", () => {
  render(<ProjectCard {...props} />);
  const cover = screen.getByRole("img", { name: "Экран приложения MCoffee" });
  expect(cover.getAttribute("sizes")).toBe(props.sizes);
});

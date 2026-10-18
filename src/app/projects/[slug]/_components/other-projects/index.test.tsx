import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { projects } from "@/constants/projects";
import { OtherProjects } from ".";

test("is a region named by its heading", () => {
  render(<OtherProjects currentSlug="sfera" />);
  expect(
    screen.getByRole("heading", { level: 2, name: "Другие проекты" })
  ).toBeDefined();
  expect(screen.getByRole("region", { name: "Другие проекты" })).toBeDefined();
});

test("links to every project except the current one", () => {
  render(<OtherProjects currentSlug="sfera" />);
  const list = screen.getByRole("list");
  const others = projects.filter((project) => project.slug !== "sfera");
  expect(within(list).getAllByRole("link")).toHaveLength(others.length);
  for (const project of others) {
    expect(
      within(list)
        .getByRole("link", { name: project.title })
        .getAttribute("href")
    ).toBe(`/projects/${project.slug}`);
  }
  expect(
    within(list).queryByRole("link", { name: "Центр охраны труда" })
  ).toBeNull();
});

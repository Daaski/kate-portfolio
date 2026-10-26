import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { projects } from "@/constants/cases/projects";
import { firstSlideImage } from "@/lib/case-slide";
import { preloadImage } from "@/lib/preload-image";
import { morphName } from "@/lib/test-utils";
import { OtherProjects } from ".";

vi.mock("next/link", async () => ({
  default: (await import("@/lib/test-utils")).LinkStub,
}));

vi.mock("@/lib/preload-image", () => ({ preloadImage: vi.fn() }));

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

test("opens a case with the morph, transition types and preloaded first slide", () => {
  render(<OtherProjects currentSlug="sfera" />);
  const project = projects.find((item) => item.slug !== "sfera");
  if (!project) {
    throw new Error("нужен хотя бы один другой проект");
  }
  const link = screen.getByRole("link", { name: project.title });
  const cover = within(link).getByRole("img");
  expect(link.getAttribute("data-transition-types")).toBe("nav");
  expect(morphName(cover)).toBeNull();

  fireEvent.click(link);

  expect(morphName(cover)).toBe(`project-${project.slug}`);
  expect(preloadImage).toHaveBeenCalledWith(firstSlideImage(project));
});

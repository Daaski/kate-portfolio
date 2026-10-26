import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { preloadImage } from "@/lib/preload-image";
import { morphName } from "@/lib/test-utils";
import { ProjectCard } from ".";

vi.mock("next/link", async () => ({
  default: (await import("@/lib/test-utils")).LinkStub,
}));

vi.mock("@/lib/preload-image", () => ({ preloadImage: vi.fn() }));

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

const transitionProps = {
  coverTransition: { default: "none", name: "project-mcoffee" },
  targetImage: {
    sizes: "100vw",
    src: { height: 1, src: "/first.png", width: 1 },
  },
  transitionTypes: ["nav"],
};

// Морф и предзагрузку делает MorphLink (его тест): здесь — что карточка их подключила.
test("opens the case with the morph, transition types and preloaded target image", () => {
  render(<ProjectCard {...props} {...transitionProps} />);
  const link = screen.getByRole("link", { name: "Карта спешелти-кофеен" });
  const cover = screen.getByRole("img", { name: "Экран приложения MCoffee" });
  expect(link.getAttribute("data-transition-types")).toBe("nav");
  expect(morphName(cover)).toBeNull();
  fireEvent.click(link);
  expect(morphName(cover)).toBe("project-mcoffee");
  expect(preloadImage).toHaveBeenCalledWith(transitionProps.targetImage);
});

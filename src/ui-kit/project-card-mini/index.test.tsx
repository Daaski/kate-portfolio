import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { preloadImage } from "@/lib/preload-image";
import { morphName } from "@/lib/test-utils";
import { ProjectCardMini } from ".";

vi.mock("next/link", async () => ({
  default: (await import("@/lib/test-utils")).LinkStub,
}));

vi.mock("@/lib/preload-image", () => ({ preloadImage: vi.fn() }));

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
  render(<ProjectCardMini {...props} {...transitionProps} />);
  const link = screen.getByRole("link", { name: "Карта спешелти-кофеен" });
  const cover = screen.getByRole("img", { name: "Экран приложения MCoffee" });
  expect(link.getAttribute("data-transition-types")).toBe("nav");
  expect(morphName(cover)).toBeNull();
  fireEvent.click(link);
  expect(morphName(cover)).toBe("project-mcoffee");
  expect(preloadImage).toHaveBeenCalledWith(transitionProps.targetImage);
});

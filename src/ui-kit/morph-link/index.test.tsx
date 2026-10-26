import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { preloadImage } from "@/lib/preload-image";
import { morphName } from "@/lib/test-utils";
import { MorphCover, MorphLink } from ".";

vi.mock("next/link", async () => ({
  default: (await import("@/lib/test-utils")).LinkStub,
}));

vi.mock("@/lib/preload-image", () => ({ preloadImage: vi.fn() }));

const targetImage = {
  sizes: "100vw",
  src: { height: 1, src: "/first.png", width: 1 },
};

function renderLink() {
  render(
    <MorphLink
      href="/projects/mcoffee"
      targetImage={targetImage}
      transitionTypes={["nav"]}
    >
      <MorphCover transition={{ default: "none", name: "project-mcoffee" }}>
        <span>Обложка</span>
      </MorphCover>
    </MorphLink>
  );
  return screen.getByRole("link", { name: "Обложка" });
}

test("links with the given href and transition types", () => {
  const link = renderLink();
  expect(link.getAttribute("href")).toBe("/projects/mcoffee");
  expect(link.getAttribute("data-transition-types")).toBe("nav");
});

// Одинаковых карточек на странице может быть несколько, а два одинаковых имени React не допускает.
test("names the cover for the morph only after navigation", () => {
  const link = renderLink();
  expect(morphName(screen.getByText("Обложка"))).toBeNull();
  fireEvent.click(link);
  expect(morphName(screen.getByText("Обложка"))).toBe("project-mcoffee");
});

test("preloads the target image on focus and navigation", () => {
  const link = renderLink();
  act(() => link.focus());
  expect(preloadImage).toHaveBeenLastCalledWith(targetImage);
  vi.mocked(preloadImage).mockClear();
  fireEvent.click(link);
  expect(preloadImage).toHaveBeenCalledWith(targetImage);
});

test("preloads the target image on pointer enter", () => {
  const link = renderLink();
  vi.mocked(preloadImage).mockClear();
  fireEvent.pointerEnter(link);
  expect(preloadImage).toHaveBeenCalledWith(targetImage);
});

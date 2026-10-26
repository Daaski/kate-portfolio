import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import type { SlideGroup } from "@/constants/cases/types";
import { morphName } from "@/lib/test-utils";
import { CaseSlides } from ".";

const groups: SlideGroup[] = [
  {
    label: "О проекте",
    slides: [
      {
        image: {
          alt: "Телефон с картой кофеен в руке",
          src: { height: 1, src: "/cover.png", width: 1 },
        },
        kind: "image",
      },
      {
        body: (
          <p>
            <strong>Заказчик</strong> — медиа о кофейной индустрии.
          </p>
        ),
        kind: "text",
        tag: "Знакомство",
      },
    ],
  },
  {
    label: "Результат",
    slides: [
      {
        body: <p>Макеты переданы в разработку.</p>,
        kind: "text",
        tag: "Итог",
      },
    ],
  },
];

test("renders a region named by its label for every group", () => {
  render(<CaseSlides accent="blue" groups={groups} slug="mcoffee" />);
  for (const name of ["О проекте", "Результат"]) {
    expect(screen.getByRole("region", { name })).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name })).toBeDefined();
  }
});

test("renders text and image slides of a group", () => {
  render(<CaseSlides accent="blue" groups={groups} slug="mcoffee" />);
  const intro = screen.getByRole("region", { name: "О проекте" });
  expect(
    within(intro).getByRole("img", { name: "Телефон с картой кофеен в руке" })
  ).toBeDefined();
  expect(within(intro).getByText("Знакомство")).toBeDefined();
  expect(within(intro).getByText("Заказчик").tagName).toBe("STRONG");
  expect(
    within(screen.getByRole("region", { name: "Результат" })).getByText("Итог")
  ).toBeDefined();
});

test("only the first slide image is eager with high fetch priority", () => {
  const image = (alt: string) => ({
    image: { alt, src: { height: 1, src: `/${alt}.png`, width: 1 } },
    kind: "image" as const,
  });
  render(
    <CaseSlides
      accent="blue"
      groups={[{ label: "Кейс", slides: [image("first"), image("second")] }]}
      slug="mcoffee"
    />
  );
  const first = screen.getByRole("img", { name: "first" });
  const second = screen.getByRole("img", { name: "second" });
  expect(first.getAttribute("fetchpriority")).toBe("high");
  expect(first.getAttribute("loading")).toBe("eager");
  expect(second.getAttribute("fetchpriority")).toBeNull();
  expect(second.getAttribute("loading")).toBe("lazy");
});

// Первый слайд — цель морфа: в него перетекает картинка проекта, по которой кликнули.
test("names only the first slide for the project morph", () => {
  render(<CaseSlides accent="blue" groups={groups} slug="mcoffee" />);
  expect(
    morphName(
      screen.getByRole("img", { name: "Телефон с картой кофеен в руке" })
    )
  ).toBe("project-mcoffee");
  expect(morphName(screen.getByText("Знакомство"))).toBeNull();
  expect(morphName(screen.getByText("Итог"))).toBeNull();
});

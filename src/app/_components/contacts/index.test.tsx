import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { Contacts } from ".";

test.each([
  [0, "Почта", "knnemova@yandex.ru", "mailto:knnemova@yandex.ru"],
  [1, "Телеграм", "@knnem", "https://t.me/knnem"],
])("item %i links %s to %s", (index, label, text, href) => {
  render(<Contacts />);
  const item = screen.getAllByRole("listitem")[index];
  expect(within(item).getByText(label)).toBeDefined();
  expect(
    within(item).getByRole("link", { name: text }).getAttribute("href")
  ).toBe(href);
});

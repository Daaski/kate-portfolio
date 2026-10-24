import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ContentCard } from ".";

test("renders the tag and the content", () => {
  render(
    <ContentCard tag="О проекте">
      <p>Компания оказывает услуги по охране труда.</p>
    </ContentCard>
  );
  expect(screen.getByText("О проекте")).toBeDefined();
  expect(
    screen.getByText("Компания оказывает услуги по охране труда.")
  ).toBeDefined();
});

test("renders emphasis and list items from the content", () => {
  render(
    <ContentCard tag="Исследование">
      <p>
        <strong>3 глубинных интервью</strong> с профессионалами
      </p>
      <ul>
        <li>
          <span>Опрос в Telegram-канале</span>
        </li>
      </ul>
    </ContentCard>
  );
  expect(screen.getByText("3 глубинных интервью").tagName).toBe("STRONG");
  expect(screen.getByRole("listitem").textContent).toBe(
    "Опрос в Telegram-канале"
  );
});

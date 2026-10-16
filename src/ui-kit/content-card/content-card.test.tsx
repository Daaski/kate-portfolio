import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ContentCard } from "./content-card";

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

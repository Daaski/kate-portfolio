import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { SectionLabel } from ".";

test("renders the label text", () => {
  render(
    <h2>
      <SectionLabel accent="pink">Было/Стало</SectionLabel>
    </h2>
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Было/Стало" })
  ).toBeDefined();
});

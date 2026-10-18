import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { CaseHeader } from ".";

test("titles the page with the level-one heading and shows the description", () => {
  render(
    <CaseHeader
      description="Сделала из справочника канал привлечения клиентов."
      title="Центр охраны труда"
    />
  );
  expect(
    screen.getByRole("heading", { level: 1, name: "Центр охраны труда" })
  ).toBeDefined();
  expect(
    screen.getByText("Сделала из справочника канал привлечения клиентов.")
  ).toBeDefined();
});

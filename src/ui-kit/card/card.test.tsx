import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Card } from "./card";

test("renders its children", () => {
  render(
    <Card>
      <p>Содержимое</p>
    </Card>
  );
  expect(screen.getByText("Содержимое")).toBeDefined();
});

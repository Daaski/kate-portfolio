import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  test("renders main heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

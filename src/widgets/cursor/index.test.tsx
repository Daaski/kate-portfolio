import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { Cursor } from ".";

vi.mock("./follower", () => ({ Follower: () => <p>Точка</p> }));

function stubPointer(fine: boolean) {
  vi.stubGlobal("matchMedia", () => ({
    addEventListener: vi.fn(),
    matches: fine,
    removeEventListener: vi.fn(),
  }));
}

test("loads the dot with a mouse", async () => {
  stubPointer(true);
  render(<Cursor />);
  expect(await screen.findByText("Точка")).toBeDefined();
});

test("renders nothing without a mouse", () => {
  stubPointer(false);
  const { container } = render(<Cursor />);
  expect(container.innerHTML).toBe("");
});

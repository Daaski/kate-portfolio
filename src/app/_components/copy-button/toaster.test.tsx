import { act, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { notify, Toaster } from "./toaster";

// sonner дописывает к aria-label региона хоткей (alt+T)
const REGION_NAME = /^Уведомления/;

test("shows a notification in the labelled region", async () => {
  render(<Toaster />);
  act(() => notify("Привет"));
  expect(await screen.findByText("Привет")).toBeDefined();
  expect(screen.getByRole("region", { name: REGION_NAME })).toBeDefined();
});

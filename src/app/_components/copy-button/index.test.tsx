import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { CopyButton } from ".";

function mockClipboard(writeText: () => Promise<void>) {
  const spy = vi.fn(writeText);
  vi.stubGlobal("navigator", { clipboard: { writeText: spy } });
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("copies the address and shows a toast", async () => {
  const writeText = mockClipboard(() => Promise.resolve());
  render(<CopyButton text="a@b.ru" />);
  fireEvent.click(screen.getByRole("button", { name: "a@b.ru" }));
  expect(writeText).toHaveBeenCalledWith("a@b.ru");
  expect(await screen.findByText("Скопировано!")).toBeDefined();
});

test("shows an error toast when the clipboard rejects", async () => {
  mockClipboard(() => Promise.reject(new Error("denied")));
  render(<CopyButton text="a@b.ru" />);
  fireEvent.click(screen.getByRole("button", { name: "a@b.ru" }));
  expect(await screen.findByText("Не удалось скопировать")).toBeDefined();
});

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { ClickSound } from ".";

const play = vi
  .spyOn(HTMLMediaElement.prototype, "play")
  .mockResolvedValue(undefined);

afterEach(() => {
  play.mockClear();
});

test("plays on a link", () => {
  render(
    <>
      <ClickSound />
      <a href="/">Ссылка</a>
    </>
  );
  fireEvent.click(screen.getByRole("link"));
  expect(play).toHaveBeenCalledOnce();
});

test("plays on an icon inside a button", () => {
  render(
    <>
      <ClickSound />
      <button type="button">
        <svg aria-label="Иконка" role="img" />
      </button>
    </>
  );
  fireEvent.click(screen.getByRole("img"));
  expect(play).toHaveBeenCalledOnce();
});

test("stays silent on plain text", () => {
  render(
    <>
      <ClickSound />
      <p>Текст</p>
    </>
  );
  fireEvent.click(screen.getByText("Текст"));
  expect(play).not.toHaveBeenCalled();
});

test("stays silent after unmount", () => {
  const { unmount } = render(<ClickSound />);
  unmount();
  render(<a href="/">Ссылка</a>);
  fireEvent.click(screen.getByRole("link"));
  expect(play).not.toHaveBeenCalled();
});

test("switches the iOS audio session to ambient", () => {
  const audioSession = { type: "auto" };
  Object.defineProperty(navigator, "audioSession", {
    configurable: true,
    value: audioSession,
  });
  render(<ClickSound />);
  Reflect.deleteProperty(navigator, "audioSession");
  expect(audioSession.type).toBe("ambient");
});

test("stays silent on a disabled button", () => {
  render(
    <>
      <ClickSound />
      <button disabled type="button">
        Кнопка
      </button>
    </>
  );
  fireEvent.click(screen.getByRole("button"));
  expect(play).not.toHaveBeenCalled();
});

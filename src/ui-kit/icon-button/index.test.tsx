import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { IconButton } from ".";

describe("IconButton", () => {
  test("renders a button of type button named by aria-label", () => {
    render(
      <IconButton aria-label="Закрыть">
        <XIcon aria-hidden="true" />
      </IconButton>
    );
    const button = screen.getByRole("button", { name: "Закрыть" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.querySelector("svg")).not.toBeNull();
  });

  test("passes button props through", () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Закрыть" onClick={onClick}>
        <XIcon aria-hidden="true" />
      </IconButton>
    );
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("renders the tertiary variant as a button", () => {
    render(
      <IconButton aria-label="Следующий слайд" variant="tertiary">
        <XIcon aria-hidden="true" />
      </IconButton>
    );
    expect(
      screen.getByRole("button", { name: "Следующий слайд" })
    ).toBeDefined();
  });
});

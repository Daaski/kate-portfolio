import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Button } from ".";

describe("Button", () => {
  test("renders a button of type button by default", () => {
    render(<Button>Следующий проект</Button>);
    const button = screen.getByRole("button", { name: "Следующий проект" });
    expect(button.getAttribute("type")).toBe("button");
  });

  test("keeps an explicit type", () => {
    render(<Button type="submit">Отправить</Button>);
    expect(
      screen.getByRole("button", { name: "Отправить" }).getAttribute("type")
    ).toBe("submit");
  });

  test("passes button props through", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Нажми</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Нажми" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

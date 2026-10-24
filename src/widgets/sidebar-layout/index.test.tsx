import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { SidebarLayout } from ".";

test("renders top, content and bottom inside main in reading order", () => {
  render(
    <SidebarLayout bottom={<p>Низ</p>} top={<p>Верх</p>}>
      <p>Контент</p>
    </SidebarLayout>
  );
  expect(screen.getByRole("main").textContent).toBe("ВерхКонтентНиз");
});

test("reads the action right after top", () => {
  render(
    <SidebarLayout
      action={<p>Действие</p>}
      bottom={<p>Низ</p>}
      top={<p>Верх</p>}
    >
      <p>Контент</p>
    </SidebarLayout>
  );
  expect(screen.getByRole("main").textContent).toBe("ВерхДействиеКонтентНиз");
});

test("reads the end after the content and before bottom", () => {
  render(
    <SidebarLayout bottom={<p>Низ</p>} end={<p>Конец</p>} top={<p>Верх</p>}>
      <p>Контент</p>
    </SidebarLayout>
  );
  expect(screen.getByRole("main").textContent).toBe("ВерхКонтентКонецНиз");
});

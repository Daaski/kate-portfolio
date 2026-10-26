import type { ReactNode } from "react";

interface CursorLabelProps {
  children: ReactNode;
  label: string;
}

export function CursorLabel({ label, children }: CursorLabelProps) {
  return (
    // Плашку рисует общий курсор (widgets/cursor): находит зону по data-cursor-label.
    // contents: у обёртки нет бокса — раскладка родителя не меняется, а у div нет роли —
    // в дереве доступности его тоже нет.
    // Системный курсор прячется, только пока общий курсор нарисован: он ставит data-cursor
    // на <html>. **: — у ссылок свой cursor: pointer, наследование от обёртки его не перебивает.
    <div
      className="contents in-data-cursor:**:cursor-none"
      data-cursor-label={label}
    >
      {children}
    </div>
  );
}

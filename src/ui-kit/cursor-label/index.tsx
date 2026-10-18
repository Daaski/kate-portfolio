"use client";

import {
  type PointerEvent,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { buttonVariants } from "@/ui-kit/button";

interface Point {
  x: number;
  y: number;
}

interface CursorLabelProps {
  children: ReactNode;
  label: string;
}

export function CursorLabel({ label, children }: CursorLabelProps) {
  // null — курсора над содержимым нет: плашка скрыта, системный курсор на месте.
  const [point, setPoint] = useState<Point | null>(null);

  // На касании и пере курсора нет — плашке незачем следовать.
  const follow = useCallback((event: PointerEvent) => {
    if (event.pointerType !== "mouse") {
      return;
    }
    setPoint({ x: event.clientX, y: event.clientY });
  }, []);

  const hide = useCallback(() => setPoint(null), []);

  return (
    // contents: у обёртки нет бокса — раскладка родителя не меняется, а у div нет роли —
    // в дереве доступности его тоже нет. React считает enter/leave по дереву компонентов, бокс не нужен.
    // Курсор прячется, только пока видна плашка: она его заменяет.
    // **: — у ссылок свой cursor: pointer, наследование от обёртки его не перебивает.
    <div
      className={point ? "contents **:cursor-none" : "contents"}
      onPointerEnter={follow}
      onPointerLeave={hide}
      onPointerMove={follow}
    >
      {children}
      {point
        ? // Портал в body: у ленты Embla transform, внутри него fixed считался бы от ленты, а не от окна.
          createPortal(
            <span
              aria-hidden="true"
              // difference: белая плашка инвертирует всё под собой, тёмный текст почти не меняет — буквы
              // показывают исходные цвета. Вариант overlay не подходит: полупрозрачный тёмный фон не инвертирует.
              className={buttonVariants({
                className:
                  "pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 bg-bg-page px-3 font-medium text-fg-primary text-xs mix-blend-difference",
                variant: null,
              })}
              // Координаты курсора — не дизайн-значение, классом их не задать.
              // translate (Tailwind) и transform — разные CSS-свойства, складываются.
              style={{ transform: `translate(${point.x}px, ${point.y}px)` }}
            >
              {label}
            </span>,
            document.body
          )
        : null}
    </div>
  );
}

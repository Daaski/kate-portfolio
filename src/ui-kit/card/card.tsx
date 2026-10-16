import { cx } from "class-variance-authority";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

// Общая подложка всех карточек: колонка, первый блок сверху, последний снизу.
// Отступы и размер задаёт вызывающий.
export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cx(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl bg-bg-surface",
        className
      )}
    >
      {children}
    </div>
  );
}

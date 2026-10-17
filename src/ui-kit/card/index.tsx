import { cx } from "class-variance-authority";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

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

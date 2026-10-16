import { cx } from "class-variance-authority";
import type { ReactNode } from "react";
import { Card } from "@/ui-kit/card";

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  tag: string;
}

// gap-8 — чтобы тег не прилипал к высокому контенту; в макете между ними пустое место.
export function ContentCard({ tag, children, className }: ContentCardProps) {
  return (
    <Card className={cx("gap-8 p-8", className)}>
      <p className="font-medium text-fg-tertiary text-xs">{tag}</p>
      <div className="flex flex-col gap-4 font-medium text-fg-tertiary text-lg tracking-snug">
        {children}
      </div>
    </Card>
  );
}

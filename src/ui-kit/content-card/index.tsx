import { cx } from "class-variance-authority";
import type { ReactNode } from "react";
import { Card } from "@/ui-kit/card";

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  tag: string;
}

export function ContentCard({ tag, children, className }: ContentCardProps) {
  return (
    <Card className={cx("gap-6 p-8 lg:gap-8", className)}>
      <p className="font-medium text-fg-tertiary text-xs">{tag}</p>
      {/* Текст приходит из данных обычными тегами (p, strong, ul) без классов — стили им даёт карточка.
          strong — чёрный фрагмент того же начертания, li — эмодзи-маркер и текст в span (Emoji). */}
      <div className="flex flex-col gap-4 font-medium text-fg-tertiary text-lg tracking-snug max-lg:leading-7 [&_li]:flex [&_li]:gap-2 [&_strong]:font-medium [&_strong]:text-fg-primary [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3">
        {children}
      </div>
    </Card>
  );
}

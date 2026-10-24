"use client";

import { useEffect, useRef, useState } from "react";
import { onScrollFrame } from "@/lib/on-scroll-frame";
import { SectionLabel, type SectionLabelAccent } from "@/ui-kit/section-label";
import { currentGroupIndex } from "./utils";

interface GroupLabelProps {
  accent: SectionLabelAccent;
  labels: string[];
}

export function GroupLabel({ accent, labels }: GroupLabelProps) {
  const [index, setIndex] = useState(0);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      // Группа та, чей слайд под серединой лейбла.
      if (!label.current) {
        return;
      }
      const { top, bottom } = label.current.getBoundingClientRect();
      const groups = [...document.querySelectorAll("[data-group]")];
      setIndex(
        currentGroupIndex(
          groups.map((group) => group.getBoundingClientRect().top),
          (top + bottom) / 2
        )
      );
    };

    return onScrollFrame(update);
  }, []);

  return (
    // Один лейбл на все группы: липнет над слайдами и меняет текст, когда под него приезжает слайд
    // другой группы. Заголовки групп для скринридера — h2 в секциях, этот лейбл — только вид.
    // Слой absolute не занимает места и задаёт, докуда лейбл липнет: inset-y-4 — лейбл на 16px ниже
    // верха первого слайда и останавливается в 16px от низа последнего. lg:top-24 = 96px от верха
    // экрана, как в Figma; на мобилке шапки над слайдами нет — лейбл ближе к верху: top-8 = 32px.
    <div className="pointer-events-none absolute inset-x-0 inset-y-4 z-10">
      <div
        aria-hidden="true"
        className="sticky top-8 flex justify-center lg:top-24"
        ref={label}
      >
        <SectionLabel accent={accent}>{labels[index]}</SectionLabel>
      </div>
    </div>
  );
}

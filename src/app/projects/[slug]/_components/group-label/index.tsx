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
      // Обёртка h-0 — меряется сама пилюля: группа та, чей слайд под её серединой.
      const pill = label.current?.firstElementChild;
      if (!pill) {
        return;
      }
      const { top, bottom } = pill.getBoundingClientRect();
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
    // Один лейбл на все группы: липнет всю колонку и меняет текст, когда под него приезжает слайд
    // другой группы. Заголовки групп для скринридера — h2 в секциях, этот лейбл — только вид.
    // Не занимает места (h-0, -mb-4 гасит gap колонки) и лежит поверх слайда: translate-y-4 —
    // на 16px ниже его верха, top-20 + 16 = 96px от верха экрана, как в Figma. На мобилке шапки
    // над слайдами нет — лейбл ближе к верху: top-4 + 16 = 32px.
    <div
      aria-hidden="true"
      className="sticky top-4 z-10 -mb-4 flex h-0 translate-y-4 items-start justify-center lg:top-20"
      ref={label}
    >
      <SectionLabel accent={accent}>{labels[index]}</SectionLabel>
    </div>
  );
}

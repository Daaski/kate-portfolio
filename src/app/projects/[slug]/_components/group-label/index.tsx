"use client";

import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import { span as MotionSpan } from "motion/react-m";
import { useCallback, useEffect, useRef, useState } from "react";
import { transition } from "@/lib/motion";
import { onScrollFrame } from "@/lib/on-scroll-frame";
import { SectionLabel, type SectionLabelAccent } from "@/ui-kit/section-label";
import { currentGroupIndex } from "./utils";

interface GroupLabelProps {
  accent: SectionLabelAccent;
  labels: string[];
}

export function GroupLabel({ accent, labels }: GroupLabelProps) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number>();
  const label = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // ResizeObserver, а не замер при смене лейбла: после загрузки шрифта текст тоже меняет ширину.
  const measure = useCallback((node: HTMLSpanElement) => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
        <SectionLabel accent={accent}>
          {/* Элемент из motion/react-m + domAnimation вместо motion.span: нужна только анимация
              значения, без жестов, drag и layout — JS страницы на ~15 КБ gzip меньше. */}
          <LazyMotion features={domAnimation}>
            {/* Анимируется настоящая width, а не layout: тот тянет пилюлю через scale и сплющил бы
                скругление и blur свечения. overflow-hidden режет только текст, свечение снаружи. */}
            <MotionSpan
              animate={{ width }}
              className="grid overflow-hidden"
              transition={reducedMotion ? { duration: 0 } : transition}
            >
              {/* justify-self-center: текст своей ширины по центру, пока контейнер её догоняет;
                  растянутый по grid он мерил бы ширину контейнера, а не свою. */}
              <span
                className="justify-self-center whitespace-nowrap"
                ref={measure}
              >
                {labels[index]}
              </span>
            </MotionSpan>
          </LazyMotion>
        </SectionLabel>
      </div>
    </div>
  );
}

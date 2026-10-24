"use client";

import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { cx } from "class-variance-authority";
import { useEffect, useState } from "react";
import { onScrollFrame } from "@/lib/on-scroll-frame";
import { IconButton } from "@/ui-kit/icon-button";
import { isArrowHidden, nextSlideIndex } from "./utils";

function measureSlides() {
  const slides = [...document.querySelectorAll<HTMLElement>("[data-slide]")];
  const rects = slides.map((slide) => slide.getBoundingClientRect());
  const [first] = slides;
  return {
    lastBottom: rects.at(-1)?.bottom ?? 0,
    // Линия, к которой приезжает слайд, — его scroll-margin-top: к ней его ставит scrollIntoView.
    line: first
      ? Number.parseFloat(getComputedStyle(first).scrollMarginTop)
      : 0,
    slides,
    tops: rects.map((rect) => rect.top),
  };
}

function scrollToNext() {
  const { slides, tops, line } = measureSlides();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  slides[nextSlideIndex(tops, line)]?.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
  });
}

export function NextSlideButton() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => {
      const { tops, lastBottom, line } = measureSlides();
      setHidden(isArrowHidden(tops, lastBottom, line, window.innerHeight));
    };

    return onScrollFrame(update);
  }, []);

  return (
    // sticky bottom-8 у правого края колонки (Figma: 16px от края, 32px от низа экрана).
    // -mt-16 = высота кнопки + gap колонки: в потоке кнопка лежит поверх низа последнего слайда,
    // не сдвигая слайды. invisible, а не unmount: место в потоке то же, Tab её пропускает.
    <IconButton
      aria-label="Следующий слайд"
      className={cx(
        "sticky bottom-8 -mt-16 mr-4 self-end max-lg:hidden",
        hidden && "invisible"
      )}
      onClick={scrollToNext}
      variant="tertiary"
    >
      <ArrowDownIcon aria-hidden="true" />
    </IconButton>
  );
}

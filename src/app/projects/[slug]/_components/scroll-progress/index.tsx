"use client";

import { useEffect, useRef } from "react";
import { onScrollFrame } from "@/lib/on-scroll-frame";
import { progress } from "@/lib/progress";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Конец полосы — кнопка «Следующий проект», а не низ страницы: зона под кнопкой дорастает после
    // остановки прокрутки, и от высоты всей страницы полоса откатывалась бы назад. Прилипшая кнопка
    // выше своей точки — полоса просто остаётся полной.
    const end = document.querySelector("[data-scroll-progress-end]");
    // Запасного расчёта по высоте страницы нет: кнопка есть на каждой странице кейса. Селектор
    // глобальный и берёт первую кнопку — второй NextProject на странице перехватил бы конец полосы.
    if (!end) {
      return;
    }
    const update = () => {
      const max =
        window.scrollY +
        end.getBoundingClientRect().bottom -
        window.innerHeight;
      // Значение меняется каждый кадр прокрутки — пишется в DOM напрямую, без ре-рендера React.
      // scale, а не transform: Tailwind v4 scale-x-0 — это CSS-свойство scale.
      bar.current?.style.setProperty(
        "scale",
        `${progress(window.scrollY, 0, max)} 1`
      );
    };

    return onScrollFrame(update);
  }, []);

  return (
    // На JS, а не на animation-timeline: scroll(): в стабильном Firefox scroll-driven animations за флагом.
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 rounded-r-xs bg-linear-to-r from-brand-gradient-start to-brand-gradient-end"
      ref={bar}
    />
  );
}

"use client";

import {
  domAnimation,
  LazyMotion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { div as MotionDiv, span as MotionSpan } from "motion/react-m";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/ui-kit/button";
import { type CursorState, getCursorState } from "./utils";

// Инерция на глаз под cuberto.com: точка догоняет курсор за ~0,3 с. Крутить здесь.
const spring = { damping: 30, mass: 0.5, stiffness: 300 };

// Пружина, а не кривая: мышь то и дело уходит со ссылки посреди анимации, а пружина при обрыве
// сохраняет скорость и не дёргается. Длительность — те же 300 мс, что у переходов сайта.
const scaleSpring = { bounce: 0, type: "spring", visualDuration: 0.3 } as const;

// Точка size-3 (12px): над ссылкой ×4 = 48px, над карточкой уступает место плашке.
const DOT_SCALE: Record<CursorState["kind"] | "hidden", number> = {
  dot: 1,
  hidden: 0,
  label: 0,
  link: 4,
};

export function Follower() {
  // hidden — мыши ещё не было или она ушла за окно: всё сжато в 0.
  const [kind, setKind] = useState<CursorState["kind"] | "hidden">("hidden");
  // Текст живёт отдельно от состояния: пока плашка сжимается, он ещё виден.
  const [label, setLabel] = useState("");
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const reducedMotion = useReducedMotion();
  // Последняя точка мыши в окне; null — мыши ещё не было или она ушла за окно.
  const point = useRef<{ x: number; y: number } | null>(null);
  const pathname = usePathname();

  const applyTarget = useCallback((target: EventTarget | null) => {
    const next = getCursorState(target);
    setKind(next.kind);
    if (next.kind === "label") {
      setLabel(next.label);
    }
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      // Первое появление — сразу под курсором, а не прилёт из угла окна.
      if (point.current && !reducedMotion) {
        x.set(event.clientX);
        y.set(event.clientY);
      } else {
        x.jump(event.clientX);
        y.jump(event.clientY);
      }
      // Курсор уже над элементом к моменту загрузки чанка — pointerover не придёт, пока он не пересечёт границу.
      if (!point.current) {
        applyTarget(event.target);
      }
      point.current = { x: event.clientX, y: event.clientY };
    };

    // pointerover, а не pointermove: состояние меняется при смене элемента, не на каждый пиксель.
    const over = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      applyTarget(event.target);
    };

    // relatedTarget null — указатель ушёл за пределы окна.
    const out = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      if (event.relatedTarget === null) {
        point.current = null;
        setKind("hidden");
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerout", out);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
    };
  }, [applyTarget, reducedMotion, x, y]);

  // Переход по ссылке меняет страницу под неподвижной мышью, а pointerover браузер не шлёт, пока
  // она не сдвинется: без перепроверки плашка ушедшей карточки висела бы на новой странице.
  // pathname в условии всегда непустой — он там, чтобы эффект зависел от смены адреса.
  useEffect(() => {
    if (pathname && point.current) {
      applyTarget(document.elementFromPoint(point.current.x, point.current.y));
    }
  }, [applyTarget, pathname]);

  const visible = kind !== "hidden";
  // По data-cursor на <html> CursorLabel прячет системный курсор: только пока его заменяет точка,
  // а не с первой отрисовки — до загрузки чанка, без JS или с пером курсор остаётся.
  useEffect(() => {
    if (!visible) {
      return;
    }
    document.documentElement.dataset.cursor = "";
    return () => {
      delete document.documentElement.dataset.cursor;
    };
  }, [visible]);

  const scaleTransition = reducedMotion ? { duration: 0 } : scaleSpring;

  return (
    <LazyMotion features={domAnimation}>
      {/* difference на общем слое: белое инвертирует всё под собой, тёмный текст плашки почти
          не меняет — буквы показывают исходные цвета. Слой 0×0 в углу окна, его двигают x/y. */}
      <MotionDiv
        aria-hidden="true"
        // will-change: x/y пишутся на каждое движение мыши, такой transform motion считает в главном
        // потоке — без отдельного слоя браузер перерисовывал бы страницу под точкой.
        className="pointer-events-none fixed top-0 left-0 z-50 mix-blend-difference will-change-transform"
        // Координаты курсора — не дизайн-значение, классом их не задать.
        style={{ x, y }}
      >
        {/* -translate-1/2 — свойство translate, scale у motion — transform: браузер применяет scale
            раньше translate, поэтому сдвиг −50% не сжимается вместе с точкой и центр стоит на курсоре. */}
        <MotionSpan
          animate={{ scale: DOT_SCALE[kind] }}
          className="-translate-1/2 absolute size-3 rounded-full bg-bg-page"
          initial={{ scale: 0 }}
          transition={scaleTransition}
        />
        <MotionSpan
          animate={{ scale: kind === "label" ? 1 : 0 }}
          // whitespace-nowrap: у слоя нулевая ширина, без него текст переносился бы по словам.
          className={buttonVariants({
            className:
              "-translate-1/2 absolute whitespace-nowrap bg-bg-page px-3 font-medium text-fg-primary text-xs",
            variant: null,
          })}
          initial={{ scale: 0 }}
          transition={scaleTransition}
        >
          {label}
        </MotionSpan>
      </MotionDiv>
    </LazyMotion>
  );
}

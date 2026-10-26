"use client";

import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import { div as MotionDiv, span as MotionSpan } from "motion/react-m";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { onScrollFrame } from "@/lib/on-scroll-frame";
import { progress } from "@/lib/progress";
import { buttonVariants } from "@/ui-kit/button";

// Допуск на дробные пиксели: низ зоны может не доехать до низа экрана на долю пикселя.
const DONE = 0.99;
// Доезд по клику с нуля, в секундах; с середины — вдвое короче: скорость заливки всегда одна.
const FINISH = 0.8;

interface NextProjectProps {
  children: ReactNode;
  href: string;
}

export function NextProject({ href, children }: NextProjectProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const zone = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  // Последний прогресс прокрутки — с него стартует доезд по клику.
  const current = useRef(0);
  // Переход начат кликом или прокруткой: прокрутка больше не пишет в DOM и не вызывает push второй раз.
  // <boolean> не лишний: без него Biome выводит тип false и считает проверки leaving.current мёртвыми.
  const leaving = useRef<boolean>(false);
  // Прогресс на момент клика; null — доезда нет.
  const [from, setFrom] = useState<number | null>(null);
  // Инерция колеса или тача пролетела бы зону за один жест прямо в переход — поэтому страница
  // кончается на кнопке, а зона дорастает, только когда прокрутка у кнопки остановилась (scrollend —
  // после инерции). Следующий жест едет по зоне. После «Назад» зоны ещё нет: восстановленная прокрутка
  // упирается в кнопку и до конца зоны не достаёт.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      return;
    }
    // Без scrollend (Safari до 26.2) остановку не поймать — зона сразу целиком, как без стопа.
    if (!("onscrollend" in window)) {
      setOpen(true);
      return;
    }
    const check = () => {
      // Клик раньше открытия зоны уже начал доезд с нуля — превью со своей длительностью отстало бы от заливки.
      if (leaving.current) {
        return;
      }
      if (
        link.current &&
        link.current.getBoundingClientRect().bottom <= window.innerHeight
      ) {
        setOpen(true);
      }
    };
    window.addEventListener("scrollend", check);
    return () => window.removeEventListener("scrollend", check);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const update = () => {
      if (leaving.current || !(zone.current && frame.current)) {
        return;
      }
      const { top, height } = zone.current.getBoundingClientRect();
      // 0 — окно превью целиком показалось снизу, 1 — низ зоны дошёл до низа экрана. В окне ниже ~320px
      // (телефон в ландшафте) окно превью выше половины зоны — старт с её середины, иначе отрезок пуст.
      const start = Math.min(frame.current.offsetHeight, height / 2);
      const p = progress(window.innerHeight - top, start, height);
      current.current = p;
      // Значения меняются каждый кадр прокрутки — пишутся в DOM напрямую, без ре-рендера React.
      fill.current?.style.setProperty("--fill", `${p * 100}%`);
      preview.current?.style.setProperty("translate", `0 ${(1 - p) * 100}%`);
      if (p >= DONE) {
        leaving.current = true;
        router.push(href);
      }
    };
    return onScrollFrame(update);
  }, [open, href, router]);

  const finish = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // Новая вкладка или окно — дело браузера, текущая страница остаётся как есть.
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      if (leaving.current) {
        return;
      }
      leaving.current = true;
      if (reducedMotion) {
        router.push(href);
        return;
      }
      setFrom(current.current);
    },
    [reducedMotion, router, href]
  );

  const goNext = useCallback(() => router.push(href), [router, href]);

  // Первый кадр задан явно — доезд стартует с того, что нарисовала прокрутка, а не с прочитанного из DOM.
  const transition = {
    duration: (1 - (from ?? 0)) * FINISH,
    ease: "easeOut",
  } as const;

  return (
    // Элементы из motion/react-m + domAnimation вместо motion.*: нужна только анимация значений —
    // domAnimation уже загружен на странице для group-label.
    <LazyMotion features={domAnimation}>
      {/* Взлётка: превью прилипает к низу экрана (sticky bottom-0 у низа зоны), пока страница прокручивает
          зону, — оно выезжает медленнее обычной прокрутки. h-[200dvh] — скорость выезда (решение
          владельца): чем выше зона, тем медленнее. Закрытая зона — конец страницы: lg:pb-15 — отступ
          под кнопкой, как над ней. На мобилке pt-4 + промежуток стопки 24 = 40 от «Других проектов»
          по Figma, под кнопкой — крестик (action в SidebarLayout). */}
      <div
        className={`flex flex-col justify-between pt-4 lg:pt-15 ${open ? "h-[200dvh]" : "lg:pb-15"}`}
        ref={zone}
      >
        {/* Кнопка у верха зоны едет вверх и прилипает к верху экрана; lg:top-20 — линия, с которой
            начинаются слайды. z-10: превью позже в DOM и тоже sticky — без него рисуется поверх.
            Клик не уходит сразу: сначала заливка и превью доезжают до конца. */}
        <Link
          className={buttonVariants({
            className: "sticky top-10 z-10 self-center lg:top-20",
          })}
          data-scroll-progress-end=""
          href={href}
          onClick={finish}
          ref={link}
        >
          Следующий проект
          {/* Заливка по Figma — тёмная копия кнопки, слева открыта на --fill. clip-path, а не ширина:
              значение меняется каждый кадр, обрезка не пересчитывает раскладку. Левый край скругляет
              rounded-full самой копии, clip-path — только передний правый: radius в clip-path ужимается
              по ширине обрезки, и в начале заливка шла бы прямоугольной полосой поверх закругления.
              Имя ссылки — у текста выше, копию скринридеру не читать. */}
          <MotionSpan
            animate={
              from === null
                ? undefined
                : { "--fill": [`${from * 100}%`, "100%"] }
            }
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-bg-inverse text-fg-inverse [--fill:0%] [clip-path:inset(0_calc(100%-var(--fill))_0_0_round_0_9999px_9999px_0)]"
            onAnimationComplete={goNext}
            ref={fill}
            transition={transition}
          >
            Следующий проект
          </MotionSpan>
        </Link>
        {/* Превью — тизер, переход даёт ссылка: скринридеру его не читать. */}
        {open ? (
          <div
            aria-hidden="true"
            className="sticky bottom-0 h-60 w-full overflow-hidden"
            ref={frame}
          >
            <MotionDiv
              animate={
                from === null
                  ? undefined
                  : { translate: [`0 ${(1 - from) * 100}%`, "0 0%"] }
              }
              className="translate-y-full"
              ref={preview}
              transition={transition}
            >
              {children}
            </MotionDiv>
          </div>
        ) : null}
      </div>
    </LazyMotion>
  );
}

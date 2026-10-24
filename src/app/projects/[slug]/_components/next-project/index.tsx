"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { onScrollFrame } from "@/lib/on-scroll-frame";
import { progress } from "@/lib/progress";
import { buttonVariants } from "@/ui-kit/button";

// Допуск на дробные пиксели: низ зоны может не доехать до низа экрана на долю пикселя.
const DONE = 0.99;

interface NextProjectProps {
  children: ReactNode;
  href: string;
}

export function NextProject({ href, children }: NextProjectProps) {
  const router = useRouter();
  const zone = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const preview = useRef<HTMLDivElement>(null);
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
    let done = false;
    const update = () => {
      if (!(zone.current && frame.current)) {
        return;
      }
      const { top, height } = zone.current.getBoundingClientRect();
      // 0 — окно превью целиком показалось снизу, 1 — низ зоны дошёл до низа экрана. В окне ниже ~320px
      // (телефон в ландшафте) окно превью выше половины зоны — старт с её середины, иначе отрезок пуст.
      const start = Math.min(frame.current.offsetHeight, height / 2);
      const p = progress(window.innerHeight - top, start, height);
      // Значения меняются каждый кадр прокрутки — пишутся в DOM напрямую, без ре-рендера React.
      link.current?.style.setProperty("--fill", `${p * 100}%`);
      preview.current?.style.setProperty("translate", `0 ${(1 - p) * 100}%`);
      if (p >= DONE && !done) {
        done = true;
        router.push(href);
      }
    };
    return onScrollFrame(update);
  }, [open, href, router]);

  return (
    // Взлётка: превью прилипает к низу экрана (sticky bottom-0 у низа зоны), пока страница прокручивает
    // зону, — оно выезжает медленнее обычной прокрутки. h-[200dvh] — скорость выезда (решение
    // владельца): чем выше зона, тем медленнее. Закрытая зона — конец страницы: lg:pb-15 — отступ
    // под кнопкой, как над ней (на мобилке под ней ещё py-10 у main).
    <div
      className={`flex flex-col justify-between pt-10 lg:pt-15 ${open ? "h-[200dvh]" : "lg:pb-15"}`}
      ref={zone}
    >
      {/* Кнопка у верха зоны едет вверх и прилипает к верху экрана; lg:top-20 — линия, с которой
          начинаются слайды. z-10: превью позже в DOM и тоже sticky — без него рисуется поверх. */}
      <Link
        className={buttonVariants({
          className: "sticky top-10 z-10 self-center [--fill:0%] lg:top-20",
        })}
        href={href}
        ref={link}
      >
        Следующий проект
        {/* Заливка по Figma — тёмная копия кнопки, слева открыта на --fill. clip-path, а не ширина:
            значение меняется каждый кадр, обрезка не пересчитывает раскладку. Левый край скругляет
            rounded-full самой копии, clip-path — только передний правый: radius в clip-path ужимается
            по ширине обрезки, и в начале заливка шла бы прямоугольной полосой поверх закругления.
            Имя ссылки — у текста выше, копию скринридеру не читать. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-bg-inverse text-fg-inverse [clip-path:inset(0_calc(100%-var(--fill))_0_0_round_0_9999px_9999px_0)]"
        >
          Следующий проект
        </span>
      </Link>
      {/* Превью — тизер, переход даёт ссылка: скринридеру его не читать. */}
      {open ? (
        <div
          aria-hidden="true"
          className="sticky bottom-0 h-60 w-full overflow-hidden"
          ref={frame}
        >
          <div className="translate-y-full" ref={preview}>
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
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

  useEffect(() => {
    // После «Назад» браузер восстанавливает прокрутку внизу страницы уже после монтирования: прыжок
    // к концу без armed выглядел бы как прокрутка пользователя. А раз страница уже внизу, первый жест
    // вверх (трекпад — пара пикселей) не опускает прогресс ниже порога — поэтому переход только при
    // пересечении порога снизу (last < DONE).
    let armed = false;
    let done = false;
    let last = 0;
    const arm = () => {
      armed = true;
    };
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
      if (p >= DONE && last < DONE && armed && !done) {
        done = true;
        router.push(href);
      }
      last = p;
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const type of inputs) {
      window.addEventListener(type, arm, { once: true, passive: true });
    }
    const stop = onScrollFrame(update);
    return () => {
      stop();
      for (const type of inputs) {
        window.removeEventListener(type, arm);
      }
    };
  }, [href, router]);

  return (
    // Взлётка: превью прилипает к низу экрана (sticky bottom-0 у низа зоны), пока страница прокручивает
    // зону, — оно выезжает медленнее обычной прокрутки. h-[150dvh] — скорость выезда (решение
    // владельца): чем выше зона, тем медленнее.
    <div
      className="flex h-[150dvh] flex-col justify-between pt-10 lg:pt-15"
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
            значение меняется каждый кадр, обрезка не пересчитывает раскладку. Имя ссылки — у текста
            выше, копию скринридеру не читать. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-bg-inverse text-fg-inverse [clip-path:inset(0_calc(100%-var(--fill))_0_0_round_9999px)]"
        >
          Следующий проект
        </span>
      </Link>
      {/* Превью — тизер, переход даёт ссылка: скринридеру его не читать. */}
      <div
        aria-hidden="true"
        className="sticky bottom-0 h-60 w-full overflow-hidden"
        ref={frame}
      >
        <div className="translate-y-full" ref={preview}>
          {children}
        </div>
      </div>
    </div>
  );
}

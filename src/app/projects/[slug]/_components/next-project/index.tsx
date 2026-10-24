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
  const block = useRef<HTMLDivElement>(null);
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
      if (!(zone.current && block.current)) {
        return;
      }
      const { top, height } = zone.current.getBoundingClientRect();
      // 0 — блок целиком показался снизу, 1 — низ зоны дошёл до низа экрана. В окне ниже ~320px
      // (телефон в ландшафте) блок выше половины зоны — старт с её середины, иначе отрезок пуст.
      const start = Math.min(block.current.offsetHeight, height / 2);
      const p = progress(window.innerHeight - top, start, height);
      // Значения меняются каждый кадр прокрутки — пишутся в DOM напрямую, без ре-рендера React.
      link.current?.style.setProperty("--fill", `${p * 120}%`);
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
    // Взлётка: блок прилипает к низу экрана (sticky bottom-0 у низа зоны), пока страница прокручивает
    // зону, — превью выезжает медленнее обычной прокрутки. h-[150dvh] — скорость выезда (решение
    // владельца): чем выше зона, тем медленнее.
    <div className="flex h-[150dvh] flex-col justify-end" ref={zone}>
      <div
        className="sticky bottom-0 flex flex-col items-center gap-40 pt-10"
        ref={block}
      >
        {/* --fill — граница заливки: при 0 весь текст серый (from на −20%), при 120% — чёрный. */}
        <Link
          className={buttonVariants({ className: "[--fill:0%]" })}
          href={href}
          ref={link}
        >
          <span className="to-(percentage:--fill) bg-linear-to-r from-[calc(var(--fill)-20%)] from-fg-primary to-fg-tertiary bg-clip-text text-transparent">
            Следующий проект
          </span>
        </Link>
        {/* Превью — тизер, переход даёт ссылка: скринридеру его не читать. */}
        <div aria-hidden="true" className="h-60 w-full overflow-hidden">
          <div className="translate-y-full" ref={preview}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

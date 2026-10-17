"use client";

import { StarFourIcon } from "@phosphor-icons/react/dist/ssr/StarFour";
import { cx } from "class-variance-authority";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  Children,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DESKTOP, nearestSlide } from "./utils";

// Ширины слайда зашиты в SLIDE_SIZES (utils.ts) — меняются вместе.
const SLIDE_CLASS =
  "min-w-0 shrink-0 basis-5/6 px-2 sm:basis-1/2 lg:min-h-0 lg:basis-auto lg:px-0 lg:py-2";

// Копия скрыта от скринридера и Tab, но кликабельна мышью и пальцем: inert заблокировал бы и клик.
function removeFromTabOrder(node: HTMLElement | null) {
  for (const element of node?.querySelectorAll<HTMLElement>(
    "a[href], button, input, select, textarea, [tabindex]"
  ) ?? []) {
    element.tabIndex = -1;
  }
}

// Нажатие не переносит фокус в копию: фокус внутри aria-hidden Chrome блокирует с предупреждением.
// Клик и перетаскивание Embla работают — Embla не смотрит на defaultPrevented у mousedown.
function keepFocusOutside(event: MouseEvent<HTMLElement>) {
  event.preventDefault();
}

interface ProjectsCarouselProps {
  children: ReactNode;
  className?: string;
}

export function ProjectsCarousel({
  children,
  className,
}: ProjectsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { breakpoints: { [DESKTOP]: { axis: "y" } }, loop: true },
    [
      WheelGesturesPlugin({
        active: false,
        breakpoints: { [DESKTOP]: { active: true } },
      }),
    ]
  );
  const [selected, setSelected] = useState(0);

  const count = Children.count(children);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const sync = () => setSelected(emblaApi.selectedScrollSnap() % count);
    sync();
    emblaApi.on("select", sync);
    emblaApi.on("reInit", sync);
    return () => {
      emblaApi.off("select", sync);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi, count]);

  const scrollTo = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!emblaApi) {
        return;
      }
      const index = Number(event.currentTarget.dataset.index);
      emblaApi.scrollTo(
        nearestSlide(emblaApi.selectedScrollSnap(), index, count),
        matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    },
    [emblaApi, count]
  );

  return (
    <section
      aria-label="Проекты"
      className={cx(
        "flex flex-col items-center gap-4 lg:flex-row lg:justify-end lg:gap-7",
        className
      )}
    >
      {/* До инициализации Embla слайды стоят от начала ленты — прячем, чтобы не было рывка.
          ponytail: без JS лента остаётся невидимой; нужен no-JS — <noscript> со стилем opacity.
          overflow-clip, а не hidden: с hidden браузер при фокусе по Tab сам прокручивал viewport
          по вертикали (Embla 8.6 сбрасывает только scrollLeft), и карточка уезжала с центра. */}
      <div
        className={cx(
          "-mx-4 self-stretch overflow-clip motion-safe:transition-opacity lg:mx-0 lg:max-w-122.5 lg:flex-1 lg:px-10",
          !emblaApi && "opacity-0"
        )}
        ref={emblaRef}
      >
        {/* touch-action по оси: жест вдоль ленты — Embla, поперёк — браузеру.
            max-lg: — классы touch-pan-* в Tailwind складываются, а не заменяют друг друга. */}
        <div className="flex touch-pinch-zoom max-lg:touch-pan-y lg:h-full lg:touch-pan-x lg:flex-col">
          {/* Промежуток 16 — паддингом слайдов (так Embla советует для loop), симметричным,
              чтобы карточка центрировалась точно. */}
          {/* Копии нужны для loop: Embla включает его, только если остальные слайды перекрывают
              viewport (canLoop), а 3 карточки не перекрывают высокое окно. Клик по индикатору
              ведёт к ближайшей копии проекта (nearestSlide). */}
          {Children.map(children, (child) => (
            <div className={SLIDE_CLASS}>{child}</div>
          ))}
          {Children.map(children, (child) => (
            <div
              aria-hidden="true"
              className={SLIDE_CLASS}
              onMouseDown={keepFocusOutside}
              ref={removeFromTabOrder}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="flex lg:flex-col">
        {Array.from({ length: count }, (_, index) => {
          const label = `Проект ${index + 1} из ${count}`;
          return (
            <button
              aria-current={index === selected ? "true" : undefined}
              aria-label={label}
              className={cx(
                "flex size-6 items-center justify-center rounded-full",
                index === selected
                  ? "text-fg-primary"
                  : "text-fg-quaternary hover:text-fg-tertiary"
              )}
              data-index={index}
              key={label}
              onClick={scrollTo}
              type="button"
            >
              {/* В Figma звезда 8px без полей, у Phosphor поля 16/256 с каждой стороны:
                svg 9px даёт звезду 8px. */}
              <StarFourIcon
                aria-hidden="true"
                className="size-2.25"
                weight="fill"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

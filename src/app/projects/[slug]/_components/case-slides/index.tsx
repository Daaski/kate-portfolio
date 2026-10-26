import Image from "next/image";
import { useId } from "react";
import { GroupLabel } from "@/app/projects/[slug]/_components/group-label";
import type { Slide, SlideGroup } from "@/constants/cases/types";
import { ContentCard } from "@/ui-kit/content-card";
import type { SectionLabelAccent } from "@/ui-kit/section-label";

// Ширина колонки контента: 628px при max-w-7xl, ~41vw на 1024 (в sizes 44vw — с запасом), на мобилке — экран без полей px-4.
// Брейкпоинты в rem, как lg в Tailwind: при крупном шрифте браузера sizes переключается вместе с вёрсткой.
const SLIDE_SIZES =
  "(min-width: 90rem) 628px, (min-width: 64rem) 44vw, calc(100vw - 2rem)";

interface SlideViewProps {
  eager?: boolean;
  slide: Slide;
}

export function SlideView({ slide, eager = false }: SlideViewProps) {
  if (slide.kind === "image") {
    return (
      // Chrome пишет в Issues «Lazy-loaded images should have explicit dimensions»: h-auto перебивает height.
      // Сдвига вёрстки нет — пропорции берутся из атрибутов width/height.
      // rounded-2xl: слайды выгружены из Figma с серым фоном за скруглёнными углами карточки —
      // обрезаем их тем же радиусом, что у Card.
      <Image
        alt={slide.image.alt}
        className="h-auto w-full rounded-2xl"
        fetchPriority={eager ? "high" : undefined}
        loading={eager ? "eager" : "lazy"}
        sizes={SLIDE_SIZES}
        src={slide.image.src}
      />
    );
  }
  return (
    <ContentCard className="lg:min-h-120" tag={slide.tag}>
      {slide.body}
    </ContentCard>
  );
}

// Ключ слайда — его подпись или alt: в кейсе они не повторяются, индекс как ключ запрещает линтер.
function slideKey(slide: Slide) {
  return slide.kind === "image" ? slide.image.alt : slide.tag;
}

interface CaseSlidesProps {
  accent: SectionLabelAccent;
  groups: SlideGroup[];
}

export function CaseSlides({ accent, groups }: CaseSlidesProps) {
  const id = useId();

  return (
    // relative — границы слоя GroupLabel: лейбл липнет, пока на экране слайды.
    <div className="relative flex flex-col gap-4">
      <GroupLabel accent={accent} labels={groups.map((group) => group.label)} />
      {groups.map((group, groupIndex) => {
        const headingId = `${id}-${groupIndex}`;
        return (
          // data-group — по верху секции GroupLabel решает, чья группа сейчас под лейблом.
          <section
            aria-labelledby={headingId}
            className="flex flex-col gap-4"
            data-group
            key={group.label}
          >
            <h2 className="sr-only" id={headingId}>
              {group.label}
            </h2>
            {group.slides.map((slide, slideIndex) => (
              <SlideView
                eager={groupIndex === 0 && slideIndex === 0}
                key={slideKey(slide)}
                slide={slide}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

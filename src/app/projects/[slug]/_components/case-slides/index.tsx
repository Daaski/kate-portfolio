import Image from "next/image";
import { useId, ViewTransition } from "react";
import { GroupLabel } from "@/app/projects/[slug]/_components/group-label";
import type { Slide, SlideGroup } from "@/constants/cases/types";
import { CASE_SLIDE_SIZES } from "@/lib/case-slide";
import { projectMorph } from "@/lib/view-transition";
import { ContentCard } from "@/ui-kit/content-card";
import type { SectionLabelAccent } from "@/ui-kit/section-label";

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
        sizes={CASE_SLIDE_SIZES}
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
  slug: string;
}

export function CaseSlides({ accent, groups, slug }: CaseSlidesProps) {
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
            {group.slides.map((slide, slideIndex) => {
              const first = groupIndex === 0 && slideIndex === 0;
              const key = slideKey(slide);
              // Первый слайд — цель морфа: картинка проекта, по которой кликнули, перетекает в него.
              return first ? (
                <ViewTransition key={key} {...projectMorph(slug)}>
                  <SlideView eager slide={slide} />
                </ViewTransition>
              ) : (
                <SlideView key={key} slide={slide} />
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

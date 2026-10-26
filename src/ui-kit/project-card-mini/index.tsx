import Image, { type StaticImageData } from "next/image";
import type { ViewTransitionProps } from "react";
import type { PreloadImage } from "@/lib/preload-image";
import { MorphCover, MorphLink } from "@/ui-kit/morph-link";

interface ProjectCardMiniProps {
  cover: { alt: string; src: StaticImageData };
  /** Морф обложки при переходе по карточке. */
  coverTransition?: ViewTransitionProps;
  href: string;
  /** Картинка страницы назначения: грузится заранее, пока пользователь наводит или переходит. */
  targetImage?: PreloadImage;
  title: string;
  /** Типы навигации для view transitions — проп transitionTypes у next/link. */
  transitionTypes?: string[];
}

export function ProjectCardMini({
  cover,
  coverTransition,
  title,
  href,
  targetImage,
  transitionTypes,
}: ProjectCardMiniProps) {
  return (
    // aria-label: текста в карточке нет, без него имя ссылки собралось бы из alt обложки.
    // Не Card: у неё rounded-2xl, а здесь по Figma 8px — снаружи не переопределить.
    <MorphLink
      aria-label={title}
      className="relative block h-37.5 w-30 overflow-hidden rounded-lg bg-bg-surface"
      href={href}
      targetImage={targetImage}
      transitionTypes={transitionTypes}
    >
      {/* Зона 96×122 (Figma 125:947): портретная обложка упирается в высоту, ландшафтная — в ширину. */}
      <div className="absolute inset-x-3 inset-y-3.5 flex items-center justify-center">
        {/* Chrome пишет в Issues «Lazy-loaded images should have explicit dimensions»: h-auto w-auto
            перебивают width/height. Сдвига вёрстки нет — блок абсолютный. */}
        <MorphCover transition={coverTransition}>
          <Image
            alt={cover.alt}
            className="h-auto max-h-full w-auto max-w-full rounded-lg border border-border-inverse shadow-xl"
            // Обложка не шире зоны — 96px на любом экране.
            sizes="96px"
            src={cover.src}
          />
        </MorphCover>
      </div>
    </MorphLink>
  );
}

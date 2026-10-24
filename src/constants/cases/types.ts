import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import type { SectionLabelAccent } from "@/ui-kit/section-label";

// Текст слайда — обычный JSX (p, strong, ul): стили тегам задаёт ContentCard, классов в данных нет.
// Картиночный слайд — фрейм карточки из Figma целиком: фон, скругление и подпись уже в картинке.
export type Slide =
  | { body: ReactNode; kind: "text"; tag: string }
  | { image: { alt: string; src: StaticImageData }; kind: "image" };

export interface SlideGroup {
  label: string;
  slides: Slide[];
}

export interface Project {
  /** Цвет лейблов групп кейса. */
  accent: SectionLabelAccent;
  cover: { alt: string; src: StaticImageData };
  description: string;
  groups: SlideGroup[];
  slug: string;
  tag: string;
  title: string;
}

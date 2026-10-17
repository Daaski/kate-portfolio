import type { StaticImageData } from "next/image";
import gstaff from "@/assets/projects/gstaff.png";
import mcoffee from "@/assets/projects/mcoffee.png";
import sfera from "@/assets/projects/sfera.png";

export interface Project {
  cover: { alt: string; src: StaticImageData };
  description: string;
  /** Страниц кейсов пока нет. */
  slug: string;
  tag: string;
  title: string;
}

export const projects: Project[] = [
  {
    cover: {
      alt: "Экран приложения MCoffee: карта кофеен и карточка кофейни",
      src: mcoffee,
    },
    description:
      "Спроектировала сервис поиска спешелти-кофеен с картой, фильтрами и рейтингом рекомендаций.",
    slug: "mcoffee",
    tag: "Mobile-first",
    title: "Карта спешелти-кофеен",
  },
  {
    cover: { alt: "Главная страница сайта центра охраны труда", src: sfera },
    description:
      "Сделала из справочника на 100+ документов канал привлечения клиентов.",
    slug: "sfera",
    tag: "Website",
    title: "Центр охраны труда",
  },
  {
    cover: {
      alt: "Главная страница сайта аутстаффинговой компании",
      src: gstaff,
    },
    description:
      "Спроектировала сайт аутстаффинговой компании с собственным каталогом вакансий.",
    slug: "gstaff",
    tag: "Website",
    title: "Аутстаффинг",
  },
];

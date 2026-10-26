import type { ViewTransitionProps } from "react";

// Тип навигации ссылками сайта. Кнопки и свайпы «Назад»/«Вперёд» браузера типа не несут, и страница
// меняется без анимации: на телефонах браузер анимирует свайп сам, наш переход дал бы двойную.
export const navTypes = ["nav"];

// Уход «Следующим проектом»: рамка превью и первый слайд — одна картинка, и старый снимок морфа
// сохраняет пропорции, а не растягивается (globals.css).
export const nextProjectTypes = ["nav", "next-project"];

// Пара морфа «картинка проекта → первый слайд кейса»: одно имя у источника и у цели.
// default: "none" — картинка не анимируется сама при чужих переходах; share — класс для CSS морфа.
export function projectMorph(slug: string): ViewTransitionProps {
  return { default: "none", name: `project-${slug}`, share: "project-morph" };
}

// Обёртка содержимого страницы — в каждом page.tsx, не в layout: layout между навигациями
// не пересоздаётся, и enter/exit в нём не срабатывают.
export const pageTransition: ViewTransitionProps = {
  default: "none",
  enter: { default: "none", nav: "page-enter" },
  exit: { default: "none", nav: "page-exit" },
};

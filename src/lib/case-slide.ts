import type { Project } from "@/constants/cases/types";
import type { PreloadImage } from "@/lib/preload-image";

// Ширина колонки контента: 628px при max-w-7xl, ~41vw на 1024 (в sizes 44vw — с запасом), на мобилке — экран без полей px-4.
// Брейкпоинты в rem, как lg в Tailwind: при крупном шрифте браузера sizes переключается вместе с вёрсткой.
export const CASE_SLIDE_SIZES =
  "(min-width: 90rem) 628px, (min-width: 64rem) 44vw, calc(100vw - 2rem)";

// Картинка первого слайда — цель морфа при открытии кейса; карточки кейса грузят её заранее.
export function firstSlideImage({ groups }: Project): PreloadImage | undefined {
  const slide = groups[0]?.slides[0];
  return slide?.kind === "image"
    ? { sizes: CASE_SLIDE_SIZES, src: slide.image.src }
    : undefined;
}

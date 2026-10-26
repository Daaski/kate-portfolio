// Брейкпоинт lg Tailwind v4. В rem, чтобы совпадать с CSS при другом размере шрифта браузера.
export const DESKTOP = "(min-width: 64rem)";

// sizes для картинок слайда, по SLIDE_CLASS ленты: на lg 410px (lg:max-w-122.5 минус lg:px-10),
// на sm basis-1/2, ниже — экран минус 52px (по 26 на соседние карточки). Здесь, а не в index.tsx:
// из "use client"-модуля серверная страница получила бы ссылку на клиентский модуль вместо строки.
export const SLIDE_SIZES = `${DESKTOP} 410px, (min-width: 40rem) 50vw, calc(100vw - 3.25rem)`;

// Лента из 2 * count слайдов (оригиналы + копии): возвращает слайд проекта index,
// ближайший по кольцу к текущему, чтобы лента не проезжала лишнее.
export function nearestSlide(
  current: number,
  index: number,
  count: number
): number {
  const diff = Math.abs(current - index);
  const distance = Math.min(diff, 2 * count - diff);
  return distance <= count / 2 ? index : index + count;
}

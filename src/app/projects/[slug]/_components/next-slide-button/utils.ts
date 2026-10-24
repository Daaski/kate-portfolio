// Допуск 1px: после scrollIntoView верх слайда бывает на 80.4 из-за дробных пикселей —
// без допуска стрелка «прокручивала» бы к слайду, который уже на месте.
export function nextSlideIndex(tops: number[], line: number) {
  return tops.findIndex((top) => top > line + 1);
}

// Стрелка не нужна, если ниже линии слайдов нет или последний слайд уже виден целиком: под ним
// «Следующий проект», а кнопка прилипла бы к низу слайда.
export function isArrowHidden(
  tops: number[],
  lastBottom: number,
  line: number,
  viewport: number
) {
  return nextSlideIndex(tops, line) === -1 || lastBottom <= viewport;
}

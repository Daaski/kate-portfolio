// Доля пути от start до end, ограниченная 0…1. Пустой отрезок (страница не прокручивается) — 0, а не NaN.
export function progress(value: number, start: number, end: number) {
  if (end <= start) {
    return 0;
  }
  return Math.min(Math.max((value - start) / (end - start), 0), 1);
}

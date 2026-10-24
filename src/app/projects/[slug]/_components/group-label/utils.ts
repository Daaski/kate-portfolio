// Текущая группа — последняя, чей верх уже дошёл до середины лейбла; выше первой — первая.
export function currentGroupIndex(tops: number[], line: number) {
  return Math.max(
    tops.findLastIndex((top) => top <= line),
    0
  );
}

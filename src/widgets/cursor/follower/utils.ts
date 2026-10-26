export type CursorState =
  | { kind: "dot" }
  | { kind: "link" }
  | { kind: "label"; label: string };

export function getCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) {
    return { kind: "dot" };
  }
  // Карточка проекта — тоже ссылка: плашка важнее увеличения, поэтому проверяется первой.
  const label = target.closest<HTMLElement>("[data-cursor-label]")?.dataset
    .cursorLabel;
  if (label) {
    return { kind: "label", label };
  }
  if (target.closest("a, button")) {
    return { kind: "link" };
  }
  return { kind: "dot" };
}

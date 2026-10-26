import { type ComponentProps, type MouseEvent, useCallback } from "react";

// Только для тестов. Настоящий Link без App Router не навигирует и onNavigate не вызывает. Заглушка
// гасит клик и вызывает onNavigate, как next/link при навигации внутри сайта, и показывает типы
// перехода атрибутом. Подключение: vi.mock("next/link", async () => ({ default: (await import(...)).LinkStub })).
export function LinkStub({
  href,
  onNavigate,
  transitionTypes,
  ...rest
}: ComponentProps<"a"> & {
  onNavigate?: (event: { preventDefault: () => void }) => void;
  transitionTypes?: string[];
}) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onNavigate?.({ preventDefault: () => undefined });
    },
    [onNavigate]
  );
  return (
    <a
      {...rest}
      data-transition-types={transitionTypes?.join(" ")}
      href={href}
      onClick={handleClick}
    />
  );
}

// Имя морфа, выданное элементу: мок ViewTransition в vitest.setup.ts пишет его в data-view-transition.
export function morphName(element: Element) {
  return (
    element
      .closest("[data-view-transition]")
      ?.getAttribute("data-view-transition") ?? null
  );
}

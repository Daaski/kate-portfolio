"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// Основной указатель, а не any-pointer: на телефоне и планшете курсора нет, даже с мышью.
const QUERY = "(pointer: fine)";

// Отдельный чанк вместе с motion: без мыши он не скачивается, с мышью грузится после гидратации,
// а не в начальных скриптах страницы.
const Follower = dynamic(
  () => import("./follower").then((module) => module.Follower),
  { ssr: false }
);

function subscribe(onChange: () => void) {
  const media = matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function Cursor() {
  // На сервере мыши нет — разметка совпадает с первой отрисовкой на любом устройстве.
  const fine = useSyncExternalStore(
    subscribe,
    () => matchMedia(QUERY).matches,
    () => false
  );
  return fine ? <Follower /> : null;
}

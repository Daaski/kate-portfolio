"use client";

import { useEffect } from "react";
import clickSound from "@/assets/sounds/click.mp3";

// Audio Session API (Safari 16.4+) в lib.dom TypeScript пока нет.
interface AudioSessionNavigator {
  audioSession?: { type: string };
}

export function ClickSound() {
  useEffect(() => {
    const { audioSession } = navigator as Navigator & AudioSessionNavigator;
    // iOS: без ambient щелчок звучит в беззвучном режиме и прерывает музыку других приложений.
    if (audioSession) {
      audioSession.type = "ambient";
    }
    const audio = new Audio(clickSound);
    // Всплытие, а не перехват: после перетаскивания карусели Embla гасит click — звука нет.
    const onClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("a[href], button:not(:disabled)")
      ) {
        audio.currentTime = 0;
        // Звук — украшение: отказ браузера играть не ошибка сайта.
        audio.play().catch(() => undefined);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

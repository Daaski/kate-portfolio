"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { Button } from "@/ui-kit/button";

// Отдельный чанк вместе с sonner: грузится после гидратации, а не в начальных
// скриптах страницы. Toaster и notify берутся из одного import(): Turbopack
// делает чанк на каждое место вызова, и sonner скачался бы дважды
const loadToaster = () => import("./toaster");
const Toaster = dynamic(() => loadToaster().then((module) => module.Toaster), {
  ssr: false,
});

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const copy = useCallback(async () => {
    // writeText — до первого await: запись в буфер разрешена только в ответ
    // на клик
    const copied = await navigator.clipboard.writeText(text).then(
      () => true,
      () => false
    );
    const { notify } = await loadToaster();
    notify(copied ? "Скопировано!" : "Не удалось скопировать");
  }, [text]);

  return (
    <>
      <Button className="max-lg:hidden" onClick={copy} variant="tertiary">
        {text}
      </Button>
      <Toaster />
    </>
  );
}

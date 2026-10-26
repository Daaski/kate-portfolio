"use client";

import { createPortal } from "react-dom";
import { Toaster as SonnerToaster, toast } from "sonner";

export function notify(message: string) {
  toast(message);
}

// Портал в body: sonner рендерит регион-section даже без тостов, и внутри
// flex-родителя кнопки (пункт контактов) он получал gap — лишние 8px высоты.
// Сервер этот модуль не рендерит (dynamic ssr: false), document есть всегда
export function Toaster() {
  return createPortal(
    <SonnerToaster
      containerAriaLabel="Уведомления"
      position="bottom-center"
      toastOptions={{
        classNames: {
          // В unstyled-режиме sonner не задаёт тосту ширину и left: без
          // inset-x-0 mx-auto w-fit плашка прижата к левому краю контейнера
          toast:
            "inset-x-0 mx-auto w-fit rounded-full bg-bg-toast px-6 py-3 font-medium font-sans text-fg-toast text-sm uppercase",
        },
        unstyled: true,
      }}
    />,
    document.body
  );
}

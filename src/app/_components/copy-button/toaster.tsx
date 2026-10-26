"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

export function notify(message: string) {
  toast(message);
}

export function Toaster() {
  return (
    <SonnerToaster
      containerAriaLabel="Уведомления"
      position="bottom-center"
      toastOptions={{
        classNames: {
          // В unstyled-режиме sonner не задаёт тосту ширину и left: без
          // inset-x-0 mx-auto w-fit плашка прижата к левому краю контейнера
          toast:
            "inset-x-0 mx-auto w-fit rounded-full bg-bg-inverse px-4 py-2 font-medium font-sans text-fg-inverse text-sm shadow-xl",
        },
        unstyled: true,
      }}
    />
  );
}

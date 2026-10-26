interface Contact {
  // На десктопе текст копируется в буфер вместо перехода по ссылке
  copyOnDesktop?: boolean;
  href: string;
  label: string;
  text: string;
}

export const contacts: Contact[] = [
  {
    copyOnDesktop: true,
    href: "mailto:knnemova@yandex.ru",
    label: "Почта",
    text: "knnemova@yandex.ru",
  },
  { href: "https://t.me/knnem", label: "Телеграм", text: "@knnem" },
];

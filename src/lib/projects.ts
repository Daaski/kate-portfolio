import gstaff from "@/assets/projects/gstaff.png";
import mcoffee from "@/assets/projects/mcoffee.png";
import sfera from "@/assets/projects/sfera.png";

export const projects = [
  {
    description:
      "Спроектировала сервис поиска спешелти-кофеен с картой, фильтрами и рейтингом рекомендаций.",
    href: "/projects/mcoffee",
    image: {
      alt: "Экран приложения MCoffee: карта кофеен и карточка кофейни",
      src: mcoffee,
    },
    tag: "Mobile-first",
    title: "Карта спешелти-кофеен",
  },
  {
    description:
      "Сделала из справочника на 100+ документов канал привлечения клиентов.",
    href: "/projects/sfera",
    image: { alt: "Главная страница сайта центра охраны труда", src: sfera },
    tag: "Website",
    title: "Центр охраны труда",
  },
  {
    description:
      "Спроектировала сайт аутстаффинговой компании с собственным каталогом вакансий.",
    href: "/projects/gstaff",
    image: {
      alt: "Главная страница сайта аутстаффинговой компании",
      src: gstaff,
    },
    tag: "Website",
    title: "Аутстаффинг",
  },
];

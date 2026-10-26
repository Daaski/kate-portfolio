import { getImageProps, type StaticImageData } from "next/image";
import { preload } from "react-dom";

export interface PreloadImage {
  sizes: string;
  src: StaticImageData;
}

// next/image ставит свой onLoad, и React не ждёт загрузку картинки перед view transition: без
// предзагрузки морф прилетал бы в пустую рамку. srcset и sizes — от того же getImageProps, что у
// <Image> цели: браузер выбирает тот же вариант, и он уже в кеше. fetchPriority не задан: первый вызов —
// при наведении, когда перехода может и не быть, а повторный при клике React отбрасывает как дубль.
export function preloadImage({ sizes, src }: PreloadImage) {
  const { props } = getImageProps({ alt: "", sizes, src });
  preload(props.src, {
    as: "image",
    imageSizes: props.sizes,
    imageSrcSet: props.srcSet,
  });
}

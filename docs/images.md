# Картинки

Свой пайплайн, без сторонних оптимизаторов: `scripts/optimize-images.ts` — адаптер Next (`adapterPath` в `next.config.ts`), его `onBuildComplete` срабатывает в конце `next build`. Через `sharp` он пишет рядом с каждой растровой картинкой в `out/` WebP-варианты `<имя>-w<ширина>q<качество>.webp` под все ширины `images.imageSizes`/`deviceSizes` и качества `images.qualities` (итоговые, с дефолтами Next). Loader (`src/lib/image-loader.ts`, `images.loaderFile`) строит `srcset` на эти файлы той же функцией `optimizedImagePath`.

- Только `next/image`, не `<img>`.
- Картинки лежат в `src/assets/` и подключаются статическим импортом (`import cover from "@/assets/cover.jpg"`): размеры и blur-плейсхолдер (`placeholder="blur"`) Next подставляет сам, а хеш в имени файла исключает конфликты WebP-вариантов.
- `public/` — только если другого выхода нет: файлу нужен постоянный URL, который знают снаружи (например, `robots.txt` или файл для стороннего сервиса). Иконки сайта — в `src/assets/icons/`, подключаются импортом в `metadata.icons` (`layout.tsx`) и в `src/app/manifest.ts`, а не metadata files в корне `src/app/` и не в `public/`. OG-картинки — файлами в `src/app/` (metadata files), не в `public/`.
- Только локальные картинки: удалённый URL loader отклоняет с ошибкой.
- Всегда непустой `alt` — пустой `alt=""` не используется даже для декоративных картинок — и `sizes`, если картинка не фиксированной ширины.
- Исходники — JPEG/PNG/WebP/AVIF в полном качестве, сжимать заранее не нужно. SVG отдаются как есть.
- Ширины и качества — дефолты Next 16 (качество 75). Менять — в `images` в `next.config.ts`, адаптер подхватит сам. Проп `quality` — только из `images.qualities`, иначе картинки нет (в dev Next предупредит).
- В `bun run dev` вариантов нет: `images.unoptimized` в dev-фазе, показываются оригиналы без `srcset`.

## Как писать картинку в коде

Размер на экране задаёт вёрстка (CSS, `width`/`height`, контейнер). `srcset` и `sizes` влияют только на то, какой файл браузер скачает: `sizes` говорит, какой ширины картинка будет на экране, и браузер берёт ближайший вариант с учётом плотности экрана.

**Большая картинка на всю ширину, первый экран** — главный элемент страницы (LCP):

```tsx
import Image from "next/image";
import hero from "@/assets/hero.jpg";

<Image
  alt="Катя за работой в мастерской"
  className="h-auto w-full"
  fetchPriority="high"
  loading="eager"
  placeholder="blur"
  sizes="100vw"
  src={hero}
/>
```

`fetchPriority="high"` + `loading="eager"` — только у одной картинки первого экрана; остальные грузятся лениво (по умолчанию). Без `loading="eager"` картинка остаётся `loading="lazy"` и начинает грузиться позже. `priority` устарел в Next 16, `preload` не нужен. Если на первом экране ряд картинок и заранее неизвестно, какая из них LCP, — `loading="eager"` у всех видимых на старте, `fetchPriority` ни у одной.

**Карточка в сетке** — картинка заполняет блок с заданными пропорциями:

```tsx
<div className="relative aspect-4/3 overflow-hidden rounded-xl">
  <Image
    alt={project.title}
    className="object-cover"
    fill
    placeholder="blur"
    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
    src={project.cover}
  />
</div>
```

С `fill` родитель обязан быть `relative` (или `absolute`/`fixed`) и иметь размер — здесь его даёт `aspect-4/3`. `sizes` повторяет сетку: 3 колонки на десктопе, 2 на планшете, 1 на телефоне. Компонент из `ui-kit/` сетку не знает, поэтому `sizes` у него — обязательный проп, строку передаёт место, где он стоит.

**Маленькая картинка фиксированного размера** — аватар, логотип, иконка:

```tsx
<Image alt="Катя" className="rounded-full" height={64} src={avatar} width={64} />
```

`sizes` не нужен: Next сам возьмёт 64px для обычного экрана и 128px для ретины (`imageSizes`).

**Картинка из данных** (список проектов в `src/constants`) — импорт в файле данных, не строковый путь:

```ts
import cover from "@/assets/projects/garden.jpg";

export const projects = [{ cover, title: "Сад" }];
```

В разметке — `src={project.cover}`, как в карточке выше.

**Декоративная картинка** — фон, орнамент: `alt` всё равно заполняется, коротко описывает, что изображено. Пустой `alt=""` не используется.

Не делать: `<img>` вместо `next/image`; удалённые URL; картинки в `public/` со строковым путём; картинку переменной ширины без `sizes` (браузер скачает вариант под всю ширину экрана); `fetchPriority="high"` больше чем у одной картинки.

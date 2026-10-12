# Картинки

Свой пайплайн, без сторонних оптимизаторов: `bun run build` = `next build` + `scripts/optimize-images.ts`. Скрипт через `sharp` пишет рядом с каждой растровой картинкой в `out/` WebP-варианты `<имя>-w<ширина>.webp` под все ширины из `images.imageSizes`/`deviceSizes` (`next.config.ts`). Loader (`src/lib/image-loader.ts`, `images.loaderFile`) строит `srcset` на эти файлы той же функцией `optimizedImagePath`.

- Только `next/image`, не `<img>`.
- Предпочтительно статический импорт из `src/assets/` (`import cover from "@/assets/cover.jpg"`): размеры и blur-плейсхолдер (`placeholder="blur"`) Next подставляет сам. Строковый путь — для файлов из `public/`, с явными `width`/`height`.
- Только локальные картинки: удалённый URL loader отклоняет с ошибкой.
- Всегда `alt` (пустой `alt=""` — только для декоративных) и `sizes`, если картинка не фиксированной ширины.
- Исходники — JPEG/PNG/WebP/AVIF в полном качестве, сжимать заранее не нужно. SVG отдаются как есть.
- Ширины меняются только в `next.config.ts` — скрипт читает их оттуда.
- В `bun run dev` вариантов нет — показываются оригиналы, это нормально.

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
  placeholder="blur"
  sizes="100vw"
  src={hero}
/>
```

`fetchPriority="high"` — только у одной картинки первого экрана; остальные грузятся лениво (по умолчанию). `priority` устарел в Next 16, `preload` не нужен.

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

С `fill` родитель обязан быть `relative` (или `absolute`/`fixed`) и иметь размер — здесь его даёт `aspect-4/3`. `sizes` повторяет сетку: 3 колонки на десктопе, 2 на планшете, 1 на телефоне.

**Маленькая картинка фиксированного размера** — аватар, логотип, иконка:

```tsx
<Image alt="Катя" className="rounded-full" height={64} src={avatar} width={64} />
```

`sizes` не нужен: Next сам возьмёт 64px для обычного экрана и 128px для ретины (`imageSizes`).

**Файл из `public/`** — когда путь приходит строкой (например, из данных в `src/lib`):

```tsx
<Image alt="Обложка проекта" height={600} src="/images/project.jpg" width={800} />
```

`width`/`height` обязательны — это пропорции, по которым резервируется место (без прыжков вёрстки), а не размер на экране. Blur-плейсхолдер работает только у статического импорта.

**Декоративная картинка** — фон, орнамент, не несёт смысла: `alt=""`.

Не делать: `<img>` вместо `next/image`; удалённые URL; картинку переменной ширины без `sizes` (браузер скачает вариант под всю ширину экрана); `fetchPriority="high"` больше чем у одной картинки.

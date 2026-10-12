<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# kate-portfolio

Сайт-портфолио. Полностью статический: `output: "export"`, `bun run build` кладёт готовый HTML/CSS/JS в `out/`, хостится на любом статик-хостинге. Без бэкенда и БД.

## Стек

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (`strict`)
- Tailwind CSS v4 — конфиг CSS-first в `src/styles/` (`@theme`), файла `tailwind.config.*` нет и не нужен
- ESLint (`eslint-config-next`)
- Bun — единственный пакетный менеджер и раннер скриптов (`bun.lock`); `npm`/`pnpm`/`yarn` не использовать. Сам Next запускается на Node (поведение по умолчанию), `--bun` не добавлять
- Анимации: позже, пакет `motion` (бывший Framer Motion, импорт из `motion/react`). Пока не установлен — не добавлять без решения

## Команды

```bash
bun install        # зависимости
bun add <pkg>      # новая зависимость (-d для dev)
bun run dev        # dev-сервер, http://localhost:3000
bun run lint       # ESLint
bun run build      # статическая сборка в out/ + проверка типов
```

Скрипты всегда через `bun run`: `bun build` без `run` — это встроенный бандлер Bun, а не `next build`.

Перед тем как считать задачу готовой: `bun run lint && bun run build` проходят без ошибок.

## Структура

```
src/
  app/                    роутинг (App Router): layout, page, metadata
    <route>/_components/  секции, нужные только этой странице
  ui-kit/                 UI-кит: базовые переиспользуемые компоненты (Button, Container, Heading…)
  styles/
    globals.css           подключение Tailwind, базовые стили; импортируется в app/layout.tsx
    theme.css             дизайн-токены: CSS-переменные + @theme
  lib/                    утилиты, контент-данные (проекты, ссылки)
public/                   картинки и статика
```

- `src/app` — только роутинг и сборка страниц из компонентов. Папка `src/pages` запрещена: Next считает её Pages Router.
- Папки с `_` (`_components`) Next исключает из роутинга. Компонент нужен на двух и больше страницах — переносится в `ui-kit/`.
- `ui-kit/` — компонент на файл (`Button.tsx`), без знания о конкретных страницах и контенте; всё приходит через пропсы.
- Все стили — в `src/styles/`. Новый токен (цвет, шрифт, радиус, отступ) — в `theme.css`, не в компонентах.
- Папки создаются, когда в них появляется первый файл, не заранее.

## Ограничения static export

Нельзя (сборка упадёт): Server Actions, Route Handlers с `Request`, `cookies()`/`headers()`, `redirects`/`rewrites`/`headers` в конфиге, `proxy`, ISR, динамические роуты без `generateStaticParams()`. Нужен сервер — сначала обсудить.

`next/image` работает без оптимизации (`images.unoptimized: true`) — картинки класть в `public/` уже сжатыми (WebP/AVIF, нужного размера).

## Правила кода

- Server Components по умолчанию. `"use client"` — только где нужны state, эффекты, браузерные API или анимации; client-граница как можно ниже по дереву.
- Next-примитивы: `next/image` для картинок, `next/font` для шрифтов, `next/link` для внутренних ссылок, Metadata API для title/description/OG.
- Стили — только классы Tailwind. Цвета, шрифты, отступы бренда — токены в `src/styles/theme.css`, не хардкод hex в разметке. CSS Modules / styled-components не использовать.
- Компоненты: файл `PascalCase.tsx`, named export. `page.tsx` / `layout.tsx` — default export (требование Next).
- Импорты через алиас `@/*` (`@/ui-kit/Button`), без длинных `../../`.
- Без `any`. Пропсы типизировать через `type`.
- Контент (список проектов, тексты) — данные в `src/lib`, разметка их рендерит, не копипастит.
- Mobile-first, адаптив обязателен. Тёмная тема — через `prefers-color-scheme` (уже настроено в `src/styles/theme.css`).
- Доступность: семантичные теги (`header`, `main`, `nav`, `section`), `alt` у картинок, видимый focus, достаточный контраст.
- Новые зависимости — только если задачу нельзя решить парой строк или нативно.

## Git

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`.
- Без AI-атрибуции: никаких `Co-Authored-By` и подписей «Generated with …» в коммитах и PR.

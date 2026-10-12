<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# kate-portfolio

Сайт-портфолио. Статический контент, без бэкенда и БД.

## Стек

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (`strict`)
- Tailwind CSS v4 — конфиг CSS-first в `src/app/globals.css` (`@theme`), файла `tailwind.config.*` нет и не нужен
- ESLint (`eslint-config-next`)
- pnpm — единственный пакетный менеджер, `npm`/`yarn` не использовать
- Анимации: позже, пакет `motion` (бывший Framer Motion, импорт из `motion/react`). Пока не установлен — не добавлять без решения

## Команды

```bash
pnpm dev     # dev-сервер, http://localhost:3000
pnpm lint    # ESLint
pnpm build   # прод-сборка + проверка типов
```

Перед тем как считать задачу готовой: `pnpm lint && pnpm build` проходят без ошибок.

## Структура

```
src/app/          роуты, layout, page, metadata
src/components/   переиспользуемые компоненты
src/lib/          утилиты, данные (проекты, ссылки)
public/           картинки и статика
```

Папки создаются, когда в них появляется первый файл, не заранее.

## Правила кода

- Server Components по умолчанию. `"use client"` — только где нужны state, эффекты, браузерные API или анимации; client-граница как можно ниже по дереву.
- Next-примитивы: `next/image` для картинок, `next/font` для шрифтов, `next/link` для внутренних ссылок, Metadata API для title/description/OG.
- Стили — только классы Tailwind. Цвета, шрифты, отступы бренда — токены в `@theme` в `globals.css`, не хардкод hex в разметке. CSS Modules / styled-components не использовать.
- Компоненты: файл `PascalCase.tsx`, named export. `page.tsx` / `layout.tsx` — default export (требование Next).
- Импорты через алиас `@/*` (`@/components/...`), без длинных `../../`.
- Без `any`. Пропсы типизировать через `type`.
- Контент (список проектов, тексты) — данные в `src/lib`, разметка их рендерит, не копипастит.
- Mobile-first, адаптив обязателен. Тёмная тема — через `prefers-color-scheme` (уже настроено в `globals.css`).
- Доступность: семантичные теги (`header`, `main`, `nav`, `section`), `alt` у картинок, видимый focus, достаточный контраст.
- Новые зависимости — только если задачу нельзя решить парой строк или нативно.

## Git

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`.
- Без AI-атрибуции: никаких `Co-Authored-By` и подписей «Generated with …» в коммитах и PR.

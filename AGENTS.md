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
- Ultracite — пресет правил поверх Biome (линтер + форматтер). `biome.json` только подключает пресеты `ultracite/biome/core`, `react`, `next`; правила не ослаблять локально без обсуждения. ESLint и Prettier не использовать
- Юнит-тесты: Vitest (`vitest.config.mts`, jsdom) + React Testing Library — чистые функции и компоненты
- Bun — единственный пакетный менеджер и раннер скриптов (`bun.lock`); `npm`/`pnpm`/`yarn` не использовать. Сам Next запускается на Node (поведение по умолчанию), `--bun` не добавлять
- Анимации: позже, пакет `motion` (бывший Framer Motion, импорт из `motion/react`). Пока не установлен — не добавлять без решения

## Команды

```bash
bun install        # зависимости
bun add <pkg>      # новая зависимость (-d для dev)
bun run dev        # dev-сервер, http://localhost:3000
bun run test       # юнит-тесты (vitest run)
bun run lint       # ultracite check: линт + проверка форматирования
bun run format     # ultracite fix: автоисправление и форматирование
bun run build      # статическая сборка в out/ + проверка типов
```

Скрипты всегда через `bun run`: `bun build` без `run` — это встроенный бандлер Bun, а не `next build`.

## Проверка перед ревью

Обязательна всегда, без исключений: после каждой законченной части работы (фича, секция, компонент, исправление бага, обновление зависимостей, правка конфига) и перед любым показом результата владельцу. После каждой мелкой правки по ходу работы — не нужна. Запускает агент сам, не спрашивая.

1. `bun run lint && bun run test && bun run build` — все зелёные.
2. `bun run dev`, затронутые страницы в браузере (Chrome DevTools MCP) на мобильной (375px) и десктопной (1440px) ширине: вёрстка не сломана, в консоли нет ошибок и предупреждений.
3. При открытой странице MCP `next-devtools` → `get_errors`: ошибок нет.

Проверка не прошла — исправить и прогнать всё заново; с красными проверками задача не готова и на ревью не показывается. Проверку не удалось запустить — прямо сказать, какую и почему, а не считать её пройденной. После проверки остановить dev-сервер и закрыть открытые вкладки.

По ходу работы хватает быстрых проверок: `compile_route` / `get_compilation_issues` вместо полной сборки, `bun run test` по изменённому модулю.

## Структура

```
src/
  app/                    роутинг (App Router): layout, page, metadata
    <route>/_components/  секции, нужные только этой странице
  ui-kit/                 UI-кит: базовые переиспользуемые компоненты (Button, Container, Heading…)
  styles/
    globals.css           подключение Tailwind, базовые стили; импортируется в app/layout.tsx
    theme.css             дизайн-токены в @theme
  lib/                    утилиты, контент-данные (проекты, ссылки), image-loader.ts
  assets/                 исходники картинок для статического импорта в next/image
scripts/                  скрипты сборки (optimize-images.ts — адаптер next build)
docs/                     гайды по отдельным темам (см. «Документация»)
public/                   только файлы с постоянным внешним URL, если иначе нельзя (см. docs/images.md)
```

- `src/app` — только роутинг и сборка страниц из компонентов. Папка `src/pages` запрещена: Next считает её Pages Router.
- Папки с `_` (`_components`) Next исключает из роутинга. Компонент нужен на двух и больше страницах — переносится в `ui-kit/`.
- `ui-kit/` — компонент на файл (`button.tsx` → `export function Button`), без знания о конкретных страницах и контенте; всё приходит через пропсы.
- Все стили — в `src/styles/`. Новый токен (цвет, шрифт, радиус, отступ) — в `theme.css`, не в компонентах.
- Папки создаются, когда в них появляется первый файл, не заранее.

## Ограничения static export

Нельзя (сборка упадёт): Server Actions, Route Handlers с `Request`, `cookies()`/`headers()`, `redirects`/`rewrites`/`headers` в конфиге, `proxy`, ISR, динамические роуты без `generateStaticParams()`. Нужен сервер — сначала обсудить.

## Картинки

Только `next/image` и только статический импорт из `src/assets/`, не `public/`; у картинки переменной ширины — `sizes`. Перед любой работой с картинками (`next/image`, `src/assets/`, `public/`, `images` в `next.config.ts`, `scripts/optimize-images.ts`) прочитать [docs/images.md](docs/images.md): как устроен пайплайн и примеры кода под типовые случаи.

## Правила кода

- Server Components по умолчанию. `"use client"` — только где нужны state, эффекты, браузерные API или анимации; client-граница как можно ниже по дереву.
- Next-примитивы: `next/image` для картинок, `next/font` для шрифтов, `next/link` для внутренних ссылок, Metadata API для title/description/OG.
- Стили — только классы Tailwind на токенах из `src/styles/theme.css`. Без кастомных решений: никаких arbitrary values (`bg-[#f5f5f5]`, `p-[13px]`), inline `style`, своих CSS-классов, CSS Modules / styled-components.
- Любой цвет — всегда токен. Нужного цвета нет — сначала добавить `--color-<имя>` в `@theme` в `theme.css`, потом использовать класс (`bg-<имя>`, `text-<имя>`). Hex/rgb/hsl вне `theme.css` запрещены. То же для шрифтов, радиусов, отступов, теней, если стандартной шкалы Tailwind не хватает.
- Источник токенов — [Figma, Variables и Styles](https://www.figma.com/design/5rmIvd1JhTzQoMBd9XVSmR/portfolio-website). Имя токена — из code syntax Figma; совпало с дефолтом Tailwind — значение берётся из Figma; значение уже есть в шкале Tailwind — используется класс Tailwind; значение отличается — переопределяется ближайшая ступень шкалы Tailwind, новое имя — только если переопределять нечего. Соответствие Figma → классы описано в комментариях в `theme.css`. Цвета в `theme.css` хранятся в `hsla()`. В разметке — семантические цвета (`bg-bg-surface`, `text-fg-secondary`), не примитивы (`neutral-*`).
- Типографика — классы Tailwind: стиль из Figma собирается из `text-*`, `font-*`, `leading-*`, `tracking-*` (`text-xl font-medium tracking-snug`), составных токенов на стиль целиком нет. Значения нет в Tailwind — дописать токен в `theme.css` в своём неймспейсе: размер — `--text-<имя>` вместе с `--text-<имя>--line-height`, жирность — `--font-weight-<имя>`, межстрочный — `--leading-<имя>`, межбуквенный — `--tracking-<имя>`.
- Имена файлов — kebab-case (требование Ultracite): `button.tsx`, `format-date.ts`. Компоненты — PascalCase в коде, named export. `page.tsx` / `layout.tsx` — default export (требование Next).
- Импорты через алиас `@/*` (`@/ui-kit/button`), без длинных `../../`.
- Без `any`. Пропсы типизировать через `type`.
- Контент (список проектов, тексты) — данные в `src/lib`, разметка их рендерит, не копипастит.
- Mobile-first, адаптив обязателен. Тёмной темы нет.
- Доступность: семантичные теги (`header`, `main`, `nav`, `section`), `alt` у картинок, видимый focus, достаточный контраст.
- Новые зависимости — только если задачу нельзя решить парой строк или нативно.

## Документация

В `AGENTS.md` — только то, что нужно почти в каждой задаче. Подробные гайды по отдельным темам — в `docs/<тема>.md`, а здесь на их месте короткий указатель: когда читать и главные правила одной строкой. Раздел выносится, только если он большой и нужен не во всех задачах; мелкие разделы остаются здесь. Меняется поведение темы — обновляется её файл в `docs/`.

## Скиллы агента

Знания о Next берутся из `node_modules/next/dist/docs/`, не из скиллов. Скиллы — готовые сценарии под конкретную задачу. Установлены в `.claude/skills/`, источники и хеши — в `skills-lock.json`.

- `next-bundle-optimizer` — когда страница медленно стартует, вырос клиентский бандл, появился новый `"use client"`-компонент или тяжёлая клиентская зависимость (например `motion`). Сначала только отчёт, без правок; исправления — после согласования с владельцем.
- Браузер — Chrome DevTools MCP (плагин ECC) на `bun run dev`. Когда проверять — раздел «Проверка перед ревью».
- Состояние dev-сервера глазами Next — MCP `next-devtools` (`.mcp.json`, версия закреплена): `get_errors` — текущие ошибки со стеками, `get_compilation_issues` / `compile_route` — проверить компиляцию, не дожидаясь `bun run build`. Сначала `nextjs_index`, потом `nextjs_call`.
- `next-dev-loop` не ставить: требует `agent-browser`, его роль выполняет Chrome DevTools MCP.
- `next-cache-components-*` и `next-partial-prefetching-*` не использовать: static export, Cache Components и Partial Prefetching не включены.

## Тесты

- Юнит-тестами покрываются чистые функции (утилиты, форматтеры, преобразования данных) и компоненты (`ui-kit/`, `_components/`) — каждые; новая/изменённая функция или компонент без теста — задача не выполнена.
- Компоненты — React Testing Library в jsdom. Проверяется то, что видят пользователь и скринридер: роли и доступные имена (`getByRole`), тексты, атрибуты (`href`, `alt`), наличие элементов в зависимости от пропсов. Классы Tailwind и внешний вид не проверяются: jsdom не применяет CSS — это браузерная проверка из «Проверки перед ревью».
- Async Server Components Vitest не поддерживает — их проверяет только браузер.
- Тест лежит рядом с тестируемым файлом и называется так же + `.test`: `src/lib/format-date.ts` → `src/lib/format-date.test.ts`, `src/ui-kit/button.tsx` → `src/ui-kit/button.test.tsx`. Отдельных папок `__tests__` нет.
- Импорты из `vitest` явно: `import { describe, expect, test } from "vitest"` (глобалы Vitest не включены).
- Логику (вычисления, форматирование, фильтрация/сортировка данных) выносить из компонентов в чистые функции в `src/lib/` — так она тестируется.
- Исправление бага начинается с теста, который этот баг воспроизводит.

## Git

- Коммит — только с явного разрешения владельца репозитория. Агент вносит изменения, прогоняет проверки и останавливается: показывает, что сделал (`git status`, `git diff`), и ждёт ревью. Разрешение действует на один коммит, не на все последующие.
- Push в `main` запрещён (и агенту, и людям) — `main` защищена на GitHub, изменения только через PR. Push своей ветки и открытие PR — тоже только после разрешения владельца.
- Каждая задача — отдельная ветка от свежего `main`: `feat/<кратко>`, `fix/<кратко>`, `chore/<кратко>`, `docs/<кратко>`, `test/<кратко>` (kebab-case, например `feat/image-optimizer`).
- Pre-commit хук — Lefthook (`lefthook.yml`): `ultracite fix` по staged-файлам, автоисправления сразу попадают в коммит, неисправимые ошибки блокируют коммит. Ставится при `bun install` (скрипт `prepare`). Тесты хук не запускает. `--no-verify` не использовать.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`.
- Без AI-атрибуции: никаких `Co-Authored-By` и подписей «Generated with …» в коммитах и PR.

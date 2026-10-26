<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# knnemova

Сайт-портфолио. Полностью статический: `output: "export"`, `bun run build` кладёт готовый HTML/CSS/JS в `out/`. Хостится на GitHub Pages — https://daaski.github.io/knnemova/, каждый push в `main` деплоит `.github/workflows/deploy.yml` (lint, тесты, сборка). Без бэкенда и БД.

## Как работать

**Сначала подумать.** Перед кодом назвать свои допущения. Неясно или задачу можно понять по-разному — спросить владельца, а не выбирать молча. Есть путь проще — сказать; подход кажется неверным — возразить.

**Минимум кода.** Только то, что попросили: без фич «на будущее», абстракций под один случай, настроек, которые никто не просил, обработки невозможных ошибок. Вышло 200 строк там, где хватило бы 50, — переписать.

**Точечные правки.** Трогать только то, что нужно для задачи: каждая изменённая строка объясняется запросом. Соседний код, комментарии и форматирование не «улучшать», стиль — как в окружающем коде. Чужой мёртвый код — упомянуть, не удалять; ставшее ненужным из-за своих правок (импорты, переменные, функции) — удалить.

**Проверяемая цель.** Задача переводится в критерий, который можно проверить: «добавить валидацию» — тесты на неверный ввод, потом код, с которым они проходят; «починить баг» — тест, воспроизводящий баг; «рефакторинг» — тесты зелёные до и после. Многошаговая задача — короткий план, у каждого шага своя проверка.

**Линтер — не всё.** Biome ловит форму кода. Корректность логики, понятные имена, граничные случаи, доступность и UX — на агенте.

## Язык

Основной язык проекта — русский: общение с владельцем, комментарии в коде, `docs/`, этот файл. Сообщения коммитов и описания PR — на английском, как в истории репозитория. Идентификаторы, имена API и технические термины — как есть.

## Стек

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (`strict`)
- Tailwind CSS v4 — конфиг CSS-first в `src/styles/` (`@theme`), файла `tailwind.config.*` нет и не нужен
- Ultracite — пресет правил поверх Biome (линтер + форматтер). `biome.json` подключает пресеты `ultracite/biome/core`, `react`, `next`, `vitest`; правила не ослаблять локально без обсуждения. ESLint и Prettier не использовать
- Юнит-тесты: Vitest (`vitest.config.mts`, jsdom) + React Testing Library — чистые функции и компоненты
- Bun — единственный пакетный менеджер и раннер скриптов (`bun.lock`); `npm`/`pnpm`/`yarn` не использовать. Сам Next запускается на Node (поведение по умолчанию), `--bun` не добавлять
- Иконки: [Phosphor](https://phosphoricons.com/) (`@phosphor-icons/react`), их же использует Figma. Импорт поштучно: `import { StarFourIcon } from "@phosphor-icons/react/dist/ssr/StarFour"` — SSR-вариант без контекста работает и в Server, и в Client Components, а корневой barrel Next по умолчанию не оптимизирует. Цвет — `currentColor` (класс `text-*`), размер — `size-*`; у Phosphor поля 16/256 с каждой стороны, иконка из Figma без полей требует svg крупнее
- Анимации, которые не сделать на CSS: пакет `motion` (бывший Framer Motion, импорт из `motion/react`)

## Команды

```bash
bun install        # зависимости
bun add <pkg>      # новая зависимость (-d для dev)
bun run dev        # dev-сервер, http://localhost:3000/knnemova
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

## Ограничения static export

Нельзя (сборка упадёт): Server Actions, Route Handlers с `Request`, `cookies()`/`headers()`, `redirects`/`rewrites`/`headers` в конфиге, `proxy`, ISR, динамические роуты без `generateStaticParams()`. Нужен сервер — сначала обсудить.

Сайт живёт в подпапке (`basePath: "/knnemova"` в `next.config.ts`), префикс ставит сам Next: внутренние ссылки — только `next/link` с адресами из `routes`, картинки — только импортом из `src/assets`. Сырой `<a href="/...">` или строковый путь к файлу из `public/` префикса не получат и на сайте дадут 404.

## Next.js

- Документация — в `node_modules/next/dist/docs/`, читать перед кодом на Next. Страниц ошибок (`/docs/messages/*`) там нет — брать `https://nextjs.org/docs/messages/<code>.md`.
- Блок `nextjs-agent-rules` в начале этого файла ведёт `next dev` — руками не править. `next dev` переписал его после обновления — закоммитить вместе с обновлением.
- Обновление Next — отдельной веткой `chore/next-<версия>`: `bunx next@canary upgrade --agent=latest`. Задача обновления просит сохранить политику в `experimental.agentUpgrade` в `next.config.ts` — это изменение не оставлять, напоминания остаются на политике по умолчанию `security`.
- `bun run dev` или `bun run build` остановился с напоминанием об обновлении — сообщить владельцу и перезапустить ту же команду, чтобы продолжить задачу.

## Правила кода

- Next-примитивы: `next/image` для картинок, `next/font` для шрифтов, `next/link` для внутренних ссылок, Metadata API для title/description/OG.
- Стили — только классы Tailwind на токенах из `src/styles/theme.css`. Без кастомных решений: никаких arbitrary values для дизайн-значений (`bg-[#f5f5f5]`, `p-[13px]`), inline `style`, своих CSS-классов, CSS Modules / styled-components.
- Исключение — одноразовое техническое значение, которого нет в Tailwind и которое не относится к дизайн-системе (не цвет, шрифт, отступ, радиус, тень из Figma): его можно писать arbitrary value прямо в классе (`grid-rows-[0fr]` для анимации высоты), в `theme.css` не выносить. Повторилось во втором месте — вынести в токен. Почему значение понадобилось — комментарий рядом.
- Любой цвет — всегда токен. Нужного цвета нет — сначала добавить `--color-<имя>` в `@theme` в `theme.css`, потом использовать класс (`bg-<имя>`, `text-<имя>`). Hex/rgb/hsl вне `theme.css` запрещены. То же для шрифтов, радиусов, отступов, теней, если стандартной шкалы Tailwind не хватает.
- Источник токенов — [Figma, Variables и Styles](https://www.figma.com/design/5rmIvd1JhTzQoMBd9XVSmR/portfolio-website). Имя токена — из code syntax Figma; совпало с дефолтом Tailwind — значение берётся из Figma; значение уже есть в шкале Tailwind — используется класс Tailwind; значение отличается — переопределяется ближайшая ступень шкалы Tailwind, новое имя — только если переопределять нечего. Соответствие Figma → классы описано в комментариях в `theme.css`. Цвета в `theme.css` хранятся в `hsla()`. В разметке — семантические цвета (`bg-bg-surface`, `text-fg-secondary`), не примитивы (`neutral-*`).
- Типографика — классы Tailwind: стиль из Figma собирается из `text-*`, `font-*`, `leading-*`, `tracking-*` (`text-xl font-medium tracking-snug`), составных токенов на стиль целиком нет. Значения нет в Tailwind — дописать токен в `theme.css` в своём неймспейсе: размер — `--text-<имя>` вместе с `--text-<имя>--line-height`, жирность — `--font-weight-<имя>`, межстрочный — `--leading-<имя>`, межбуквенный — `--tracking-<имя>`.
- Имена файлов — kebab-case (требование Ultracite): `button.tsx`, `format-date.ts`. Компоненты — PascalCase в коде, named export. `page.tsx` / `layout.tsx` — default export (требование Next).
- Импорты через алиас `@/*` (`@/ui-kit/button`), без длинных `../../`. Алиасы — только через `paths` в `tsconfig.json`; `baseUrl` не добавлять: в TypeScript 6 он deprecated, в 7 удаляется.
- Комментарий пишется, только если объясняет то, чего не видно из самого кода: почему сделано именно так, обход бага или ограничения библиотеки, откуда взялось неочевидное значение. Пересказ кода («обёртка», «рендерим список», «значение по умолчанию») не пишется. Комментарии — на русском. Идентификаторы, имена API, классы и технические термины — как есть.
- Без `any`. Пропсы-объекты — `interface` (требование Ultracite, `useConsistentTypeDefinitions`); `type` — только для пересечений и объединений (`ComponentProps<"button"> & …`).
- Mobile-first, адаптив обязателен. Тёмной темы нет.
- Доступность: семантичные теги (`header`, `main`, `nav`, `section`), непустой `alt` у каждой картинки (`alt=""` не используется), видимый focus, достаточный контраст.
- Новые зависимости — только если задачу нельзя решить парой строк или нативно.

## Документация

В `AGENTS.md` — только то, что нужно почти в каждой задаче. Гайды по отдельным темам — в `docs/<тема>.md`, а здесь на каждый — только ссылка в списке ниже: о чём гайд и когда его читать. Содержимое гайдов здесь не повторяется. Меняется поведение темы — обновляется её файл в `docs/`; новый гайд — сразу ссылка сюда.

- [docs/architecture.md](docs/architecture.md) — как устроен проект и почему так: структура папок, слои, где что лежит, структура компонентов, общие приёмы. Читать перед созданием любого файла или компонента и перед архитектурными решениями.
- [docs/images.md](docs/images.md) — пайплайн картинок и примеры кода под типовые случаи. Читать перед любой работой с картинками: `next/image`, `src/assets/`, `public/`, `images` в `next.config.ts`, `scripts/optimize-images.ts`.
- Spec и планы агента по задачам этого проекта — только в `docs/superpowers/specs/` и `docs/superpowers/plans/` (`YYYY-MM-DD-<тема>.md`), не во временных папках и не вне репозитория. Папка в `.gitignore`: файлы локальные, в коммиты не попадают.

## Скиллы агента

Знания о Next берутся из `node_modules/next/dist/docs/`, не из скиллов. Скиллы — готовые сценарии под конкретную задачу. Установлены в `.claude/skills/`, источники и хеши — в `skills-lock.json`.

- `next-bundle-optimizer` — когда страница медленно стартует, вырос клиентский бандл, появился новый `"use client"`-компонент или тяжёлая клиентская зависимость (например `motion`). Сначала только отчёт, без правок; исправления — после согласования с владельцем.
- Браузер — Chrome DevTools MCP (плагин ECC) на `bun run dev`. Когда проверять — раздел «Проверка перед ревью».
- Состояние dev-сервера глазами Next — MCP `next-devtools` (`.mcp.json`, версия закреплена): `get_errors` — текущие ошибки со стеками, `get_compilation_issues` / `compile_route` — проверить компиляцию, не дожидаясь `bun run build`. Сначала `nextjs_index`, потом `nextjs_call`.
- `next-dev-loop` не ставить: требует `agent-browser`, его роль выполняет Chrome DevTools MCP.
- `next-cache-components-*` и `next-partial-prefetching-*` не использовать: static export, Cache Components и Partial Prefetching не включены.

## Тесты

- Юнит-тестами покрываются чистые функции (утилиты, форматтеры, преобразования данных) и компоненты (`ui-kit/`, `widgets/`, `_components/`) — каждые; новая/изменённая функция или компонент без теста — задача не выполнена.
- Компоненты — React Testing Library в jsdom. Проверяется то, что видят пользователь и скринридер: роли и доступные имена (`getByRole`), тексты, атрибуты (`href`, `alt`), наличие элементов в зависимости от пропсов. Классы Tailwind и внешний вид не проверяются: jsdom не применяет CSS — это браузерная проверка из «Проверки перед ревью».
- Async Server Components Vitest не поддерживает — их проверяет только браузер.
- Тест лежит рядом с тестируемым файлом и называется так же + `.test`: `src/lib/format-date.ts` → `src/lib/format-date.test.ts`, `src/ui-kit/button/index.tsx` → `src/ui-kit/button/index.test.tsx`. Тест компонента импортирует его из своей папки (`import { Button } from "."`). Отдельных папок `__tests__` нет.
- Импорты из `vitest` явно: `import { describe, expect, test } from "vitest"` (глобалы Vitest не включены).
- Проверки — внутри `test()`. Асинхронные тесты — через `async`/`await`, не `done`-колбэк. `describe` без глубокой вложенности. `.only` и `.skip` в коммит не попадают. Всё это ловит пресет `ultracite/biome/vitest`.
- Логику (вычисления, форматирование, фильтрация/сортировка данных) выносить из компонентов в чистые функции — так она тестируется.
- Исправление бага начинается с теста, который этот баг воспроизводит.

## Типовые задачи

- Новая страница: адрес в `src/constants/routes.ts`, затем `src/app/<route>/page.tsx` с Metadata; секции только этой страницы — `src/app/<route>/_components/<name>/`.
- Новый компонент UI-кита: прочитать [docs/architecture.md](docs/architecture.md), затем `src/ui-kit/<name>/index.tsx` и `index.test.tsx` рядом.
- Новый виджет (каркас, область страницы): прочитать [docs/architecture.md](docs/architecture.md), затем `src/widgets/<name>/index.tsx` и `index.test.tsx` рядом.
- Новый цвет, отступ, шрифт: значение и code syntax из Figma, токен в `src/styles/theme.css` (см. «Правила кода»).
- Новая картинка: файл в `src/assets/`, код по [docs/images.md](docs/images.md).
- Новый или изменённый контент (проекты, контакты, тексты): данные в `src/constants/`, разметку не трогать.
- Обновление Next: раздел «Next.js».

## Git

- Коммит — только с явного разрешения владельца репозитория. Агент вносит изменения, прогоняет проверки и останавливается: показывает, что сделал (`git status`, `git diff`), и ждёт ревью. Разрешение действует на один коммит, не на все последующие.
- Push в `main` запрещён (и агенту, и людям) — `main` защищена на GitHub, изменения только через PR. Push своей ветки и открытие PR — тоже только после разрешения владельца.
- Ветка влита в `main` — удалить её и локально, и на GitHub: `gh pr merge <номер> --merge --delete-branch` делает и то и другое и переключает на `main`, потом `git pull --prune` — без него остаётся ссылка `origin/<ветка>`.
- Каждая задача — отдельная ветка от свежего `main`: `feat/<кратко>`, `fix/<кратко>`, `chore/<кратко>`, `docs/<кратко>`, `test/<кратко>` (kebab-case, например `feat/image-optimizer`).
- Pre-commit хук — Lefthook (`lefthook.yml`): `ultracite fix` по staged-файлам, автоисправления сразу попадают в коммит, неисправимые ошибки блокируют коммит. Ставится при `bun install` (скрипт `prepare`). Тесты хук не запускает. `--no-verify` не использовать.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`.
- Без AI-атрибуции: никаких `Co-Authored-By` и подписей «Generated with …» в коммитах и PR.

export function Greeting() {
  return (
    <div className="flex flex-col gap-4">
      {/* Пробел перед br нужен: br в textContent не попадает, без пробела
          поисковик и скринридер прочитают «ЕкатеринаUX/UI-дизайнер».
          В Figma у роли fg-disabled: 2,9:1 к белому не проходит WCAG AA. */}
      <h1 className="font-medium text-3xl tracking-tight">
        Немова Екатерина <br />
        <span className="text-fg-tertiary text-lg tracking-snug">
          UX/UI-дизайнер
        </span>
      </h1>
      <p className="text-fg-tertiary text-sm">
        Помогаю продуктам расти через понятный интерфейс, нахожу, где
        пользователи теряются, проверяю гипотезы и довожу решения до релиза.
        Работаю с B2B и B2C, web и mobile.
      </p>
    </div>
  );
}

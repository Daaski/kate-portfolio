import { cx } from "class-variance-authority";

interface GreetingProps {
  className?: string;
}

export function Greeting({ className }: GreetingProps) {
  return (
    <div className={cx("flex flex-col gap-4", className)}>
      <h1 className="font-medium text-3xl tracking-tight">Привет</h1>
      <p className="text-fg-tertiary text-sm">
        Меня зовут{" "}
        <span className="font-medium text-fg-primary">
          Екатерина, я UX/UI-дизайнер с опытом 2+ лет.
        </span>{" "}
        Помогаю продуктам расти через понятный интерфейс, нахожу, где
        пользователи теряются, проверяю гипотезы и довожу решения до релиза.
        Работаю с B2B и B2C, web и mobile.
      </p>
    </div>
  );
}

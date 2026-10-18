import type { ReactNode } from "react";

interface SidebarLayoutProps {
  action?: ReactNode;
  bottom: ReactNode;
  children?: ReactNode;
  top: ReactNode;
}

export function SidebarLayout({
  top,
  action,
  bottom,
  children,
}: SidebarLayoutProps) {
  return (
    // top и bottom делят одну ячейку грида: прижаты к её краям и прилипают к краям экрана,
    // пока справа прокручивается длинный контент. Порядок в DOM — порядок чтения и мобильной стопки.
    <main className="flex flex-col gap-10 py-10 lg:grid lg:min-h-dvh lg:grid-cols-12 lg:gap-x-6 lg:py-0">
      {/* action — в следующей за top колонке: subgrid даёт им общие отступ сверху и sticky.
          На мобилке обёртка растворяется (contents), чтобы action мог уйти в конец стопки. */}
      <div className="max-lg:contents lg:sticky lg:top-0 lg:col-span-5 lg:col-start-2 lg:row-start-1 lg:grid lg:grid-cols-subgrid lg:self-start lg:pt-20">
        <div className="lg:col-span-4">{top}</div>
        {action ? (
          // Мобилка: order-last ставит action в конец стопки, sticky держит его у низа экрана.
          // Место в потоке он занимает сам — последний блок не перекрыт. В DOM — сразу после
          // top, поэтому в порядке Tab идёт рано.
          // -mr-2: по Figma action в 16px от колонки контента, а край колонки — в 24 (gap-x-6).
          <div className="max-lg:sticky max-lg:bottom-8 max-lg:order-last max-lg:self-center lg:-mr-2 lg:self-start lg:justify-self-end">
            {action}
          </div>
        ) : null}
      </div>
      <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
        {children}
      </div>
      <div className="lg:sticky lg:bottom-0 lg:col-span-4 lg:col-start-2 lg:row-start-1 lg:self-end lg:pb-10">
        {bottom}
      </div>
    </main>
  );
}

import { cx } from "class-variance-authority";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useId } from "react";
import { Card } from "@/ui-kit/card";

interface ProjectCardProps {
  className?: string;
  description: string;
  /** Обложка на первом экране: грузится сразу, а не лениво. */
  eager?: boolean;
  href: string;
  image: { alt: string; src: StaticImageData };
  tag: string;
  title: string;
}

export function ProjectCard({
  tag,
  title,
  description,
  image,
  href,
  className,
  eager = false,
}: ProjectCardProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Link
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={cx("group block rounded-2xl", className)}
      href={href}
    >
      <Card className="isolate aspect-4/5">
        <div className="absolute inset-x-7.5 inset-y-20 -z-10 flex items-center justify-center">
          <Image
            alt={image.alt}
            className="h-auto max-h-full w-auto max-w-full rounded-3xl border-2 border-border-inverse shadow-xl"
            loading={eager ? "eager" : "lazy"}
            // ponytail: рассчитано на сетку в 1/2/3 колонки внутри max-w-7xl; другая сетка — добавить проп sizes.
            sizes="(min-width: 1280px) 390px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={image.src}
          />
        </div>
        <p className="p-6 font-medium text-fg-tertiary text-xs">{tag}</p>
        <div className="relative p-6 before:absolute before:inset-0 before:-z-10 before:bg-linear-to-t before:from-50% before:from-gradient-grey before:to-transparent motion-safe:before:transition-opacity motion-safe:before:duration-300 lg:before:opacity-0 lg:group-focus-visible:before:opacity-100 lg:group-hover:before:opacity-100">
          <p
            className="font-medium text-fg-primary text-xl tracking-snug"
            id={titleId}
          >
            {title}
          </p>
          {/* Описание на lg свёрнуто до нулевой высоты, но остаётся в дереве доступности.
              Анимируется 0fr → 1fr: grid-rows-1 — это minmax(0, 1fr), к нему переход скачком. */}
          <div className="grid grid-rows-[1fr] motion-safe:transition-all motion-safe:duration-300 lg:grid-rows-[0fr] lg:group-focus-visible:grid-rows-[1fr] lg:group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p
                className="pt-1 text-fg-secondary text-sm motion-safe:transition motion-safe:duration-300 lg:translate-y-full lg:opacity-0 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                id={descriptionId}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

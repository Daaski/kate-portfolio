import { projects } from "@/lib/projects";
import { Button, buttonVariants } from "@/ui-kit/button";
import { ContentCard } from "@/ui-kit/content-card";
import { ProjectCard } from "@/ui-kit/project-card";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 lg:px-10">
      <h1 className="font-medium text-3xl tracking-tight">Катя — портфолио</h1>
      <section
        aria-label="Проекты"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Первый ряд сетки на lg — три карточки, LCP может стать любая из них. */}
        {projects.map((project, index) => (
          <ProjectCard eager={index < 3} key={project.href} {...project} />
        ))}
      </section>
      <ContentCard className="min-h-120 lg:max-w-2xl" tag="О проекте">
        <p>
          Компания оказывает услуги по охране труда и занимается обучением
          сотрудников.
        </p>
        <p>
          Раньше у неё был только раздел на сайте группы компаний.{" "}
          <span className="text-fg-primary">
            Задача — превратить его в самостоятельный сайт, который продаёт.
          </span>
        </p>
        <p>
          Я была единственным дизайнером в команде из маркетолога,
          SEO-специалиста и разработчика.
        </p>
      </ContentCard>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-bg-muted p-6">
        <Button>Следующий проект</Button>
        <a
          className={buttonVariants({ variant: "tertiary" })}
          href="mailto:knnemova@yandex.ru"
        >
          knnemova@yandex.ru
        </a>
        <Button variant="overlay">Подробнее</Button>
      </div>
    </main>
  );
}

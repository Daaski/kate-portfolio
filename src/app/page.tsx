import { Contacts } from "@/app/_components/contacts";
import { Greeting } from "@/app/_components/greeting";
import { ProjectsCarousel } from "@/app/_components/projects-carousel";
import { SLIDE_SIZES } from "@/app/_components/projects-carousel/utils";
import { projects } from "@/constants/projects";
import { routes } from "@/constants/routes";
import { ProjectCard } from "@/ui-kit/project-card";

export default function Home() {
  return (
    <main className="flex flex-col gap-10 py-10 lg:grid lg:h-dvh lg:grid-cols-12 lg:grid-rows-2 lg:gap-x-6 lg:gap-y-0 lg:overflow-hidden lg:py-0">
      <Greeting className="lg:col-span-4 lg:col-start-2 lg:self-start lg:pt-20" />
      <ProjectsCarousel className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
        {projects.map((project, index) => (
          <ProjectCard
            {...project}
            // На старте видны первая (по центру), вторая и последняя: лента зациклена.
            eager={index < 2 || index === projects.length - 1}
            href={routes.project(project.slug)}
            key={project.slug}
            sizes={SLIDE_SIZES}
          />
        ))}
      </ProjectsCarousel>
      <Contacts className="lg:col-span-4 lg:col-start-2 lg:row-start-2 lg:self-end lg:pb-10" />
    </main>
  );
}

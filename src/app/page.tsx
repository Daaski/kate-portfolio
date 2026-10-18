import { Contacts } from "@/app/_components/contacts";
import { Greeting } from "@/app/_components/greeting";
import { ProjectsCarousel } from "@/app/_components/projects-carousel";
import { SLIDE_SIZES } from "@/app/_components/projects-carousel/utils";
import { projects } from "@/constants/projects";
import { routes } from "@/constants/routes";
import { CursorLabel } from "@/ui-kit/cursor-label";
import { ProjectCard } from "@/ui-kit/project-card";
import { SidebarLayout } from "@/widgets/sidebar-layout";

export default function Home() {
  return (
    <SidebarLayout bottom={<Contacts />} top={<Greeting />}>
      <ProjectsCarousel className="lg:h-dvh">
        {projects.map((project, index) => (
          <CursorLabel key={project.slug} label="Подробнее">
            <ProjectCard
              {...project}
              // На старте видны первая (по центру), вторая и последняя: лента зациклена.
              eager={index < 2 || index === projects.length - 1}
              href={routes.project(project.slug)}
              sizes={SLIDE_SIZES}
            />
          </CursorLabel>
        ))}
      </ProjectsCarousel>
    </SidebarLayout>
  );
}

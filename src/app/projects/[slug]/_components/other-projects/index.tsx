import { useId } from "react";
import { projects } from "@/constants/cases/projects";
import { routes } from "@/constants/routes";
import { firstSlideImage } from "@/lib/case-slide";
import { navTypes, projectMorph } from "@/lib/view-transition";
import { CursorLabel } from "@/ui-kit/cursor-label";
import { ProjectCardMini } from "@/ui-kit/project-card-mini";

interface OtherProjectsProps {
  currentSlug: string;
}

export function OtherProjects({ currentSlug }: OtherProjectsProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h2 className="font-medium text-sm max-lg:px-2" id={headingId}>
        Другие проекты
      </h2>
      <ul className="flex gap-2">
        {projects
          .filter((project) => project.slug !== currentSlug)
          .map((project) => (
            <li key={project.slug}>
              <CursorLabel label="Подробнее">
                <ProjectCardMini
                  {...project}
                  coverTransition={projectMorph(project.slug)}
                  href={routes.project(project.slug)}
                  targetImage={firstSlideImage(project)}
                  transitionTypes={navTypes}
                />
              </CursorLabel>
            </li>
          ))}
      </ul>
    </section>
  );
}

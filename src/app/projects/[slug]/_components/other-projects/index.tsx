import { useId } from "react";
import { projects } from "@/constants/projects";
import { routes } from "@/constants/routes";
import { CursorLabel } from "@/ui-kit/cursor-label";
import { ProjectCardMini } from "@/ui-kit/project-card-mini";

interface OtherProjectsProps {
  currentSlug: string;
}

export function OtherProjects({ currentSlug }: OtherProjectsProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h2 className="font-medium text-sm" id={headingId}>
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
                  href={routes.project(project.slug)}
                />
              </CursorLabel>
            </li>
          ))}
      </ul>
    </section>
  );
}

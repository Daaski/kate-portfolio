import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseHeader } from "@/app/projects/[slug]/_components/case-header";
import {
  CaseSlides,
  SlideView,
} from "@/app/projects/[slug]/_components/case-slides";
import { CloseLink } from "@/app/projects/[slug]/_components/close-link";
import { NextProject } from "@/app/projects/[slug]/_components/next-project";
import { OtherProjects } from "@/app/projects/[slug]/_components/other-projects";
import { ScrollProgress } from "@/app/projects/[slug]/_components/scroll-progress";
import { openGraph } from "@/app/shared-metadata";
import { nextProject, projects } from "@/constants/cases/projects";
import { routes } from "@/constants/routes";
import { SidebarLayout } from "@/widgets/sidebar-layout";

// Static export: страницы только для известных проектов, остальные адреса — 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

// С dynamicParams = false неизвестный slug сюда не придёт; notFound() — для сужения типа.
function findProject(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    notFound();
  }
  return project;
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug, title, description } = findProject((await params).slug);
  const url = routes.project(slug);
  return {
    alternates: { canonical: url },
    description,
    openGraph: { ...openGraph, description, title, url },
    title,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = findProject(slug);
  const next = nextProject(slug);

  return (
    <>
      <ScrollProgress />
      <SidebarLayout
        action={<CloseLink />}
        bottom={<OtherProjects currentSlug={slug} />}
        end={
          <NextProject href={routes.project(next.slug)}>
            <SlideView slide={next.groups[0].slides[0]} />
          </NextProject>
        }
        top={<CaseHeader {...project} />}
      >
        {/* pt-20 — слайды начинаются на одной линии с шапкой (Figma: carousel/sections y=80). */}
        <div className="lg:pt-20">
          <CaseSlides accent={project.accent} groups={project.groups} />
        </div>
      </SidebarLayout>
    </>
  );
}

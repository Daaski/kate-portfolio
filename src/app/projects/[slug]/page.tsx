import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseHeader } from "@/app/projects/[slug]/_components/case-header";
import { CloseLink } from "@/app/projects/[slug]/_components/close-link";
import { OtherProjects } from "@/app/projects/[slug]/_components/other-projects";
import { projects } from "@/constants/projects";
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
  const { title, description } = findProject((await params).slug);
  return { description, title };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = findProject(slug);

  // Контента кейса пока нет — отдельная задача, children появятся с ним.
  return (
    <SidebarLayout
      action={<CloseLink />}
      bottom={<OtherProjects currentSlug={slug} />}
      top={<CaseHeader {...project} />}
    />
  );
}

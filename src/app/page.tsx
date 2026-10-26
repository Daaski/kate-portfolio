import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Contacts } from "@/app/_components/contacts";
import { Greeting } from "@/app/_components/greeting";
import { ProjectsCarousel } from "@/app/_components/projects-carousel";
import { SLIDE_SIZES } from "@/app/_components/projects-carousel/utils";
import { openGraph } from "@/app/shared-metadata";
import { projects } from "@/constants/cases/projects";
import { contacts } from "@/constants/contacts";
import { routes } from "@/constants/routes";
import { site } from "@/constants/site";
import { firstSlideImage } from "@/lib/case-slide";
import { navTypes, pageTransition, projectMorph } from "@/lib/view-transition";
import { CursorLabel } from "@/ui-kit/cursor-label";
import { ProjectCard } from "@/ui-kit/project-card";
import { SidebarLayout } from "@/widgets/sidebar-layout";

export const metadata: Metadata = {
  alternates: { canonical: routes.home },
  openGraph: {
    ...openGraph,
    description: site.description,
    title: site.title,
    url: routes.home,
  },
};

// Разметка ProfilePage: https://developers.google.com/search/docs/appearance/structured-data/profile-page
const profile = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    alternateName: ["Екатерина Немова", "Катя Немова"],
    description: site.description,
    jobTitle: "UX/UI Designer",
    name: site.name,
    // sameAs — страницы человека на других сайтах, mailto: туда не относится
    sameAs: contacts
      .filter(({ href }) => href.startsWith("https://"))
      .map(({ href }) => href),
    url: `${site.url}${routes.home}`,
  },
};

export default function Home() {
  return (
    <ViewTransition {...pageTransition}>
      <SidebarLayout bottom={<Contacts />} top={<Greeting />}>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD из своих данных, < экранирован, как в гайде Next
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profile).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
        <ProjectsCarousel className="lg:h-dvh">
          {projects.map((project, index) => (
            <CursorLabel key={project.slug} label="Подробнее">
              <ProjectCard
                {...project}
                coverTransition={projectMorph(project.slug)}
                // На старте видны первая (по центру), вторая и последняя: лента зациклена.
                eager={index < 2 || index === projects.length - 1}
                href={routes.project(project.slug)}
                sizes={SLIDE_SIZES}
                targetImage={firstSlideImage(project)}
                transitionTypes={navTypes}
              />
            </CursorLabel>
          ))}
        </ProjectsCarousel>
      </SidebarLayout>
    </ViewTransition>
  );
}

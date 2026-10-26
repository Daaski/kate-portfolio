import type { MetadataRoute } from "next";
import { projects } from "@/constants/cases/projects";
import { routes } from "@/constants/routes";
import { site } from "@/constants/site";

// output: "export" без этого не соберёт metadata route
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [routes.home, ...projects.map(({ slug }) => routes.project(slug))].map(
    (path) => ({ url: `${site.url}${path}` })
  );
}

import type { MetadataRoute } from "next";
import { site } from "@/constants/site";

// output: "export" без этого не соберёт metadata route
export const dynamic = "force-static";

// Поисковики читают robots.txt только из корня хоста: из подпапки
// daaski.github.io/knnemova файл не работает, заработает со своим доменом.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: "/", userAgent: "*" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

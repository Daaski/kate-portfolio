import { expect, test } from "vitest";
import { projects } from "@/constants/cases/projects";
import sitemap from "./sitemap";

test("lists the home page and every case by absolute URL", () => {
  expect(sitemap().map(({ url }) => url)).toEqual([
    "https://daaski.github.io/knnemova/",
    ...projects.map(
      ({ slug }) => `https://daaski.github.io/knnemova/projects/${slug}`
    ),
  ]);
});

import { expect, test } from "vitest";
import { projects } from "@/constants/cases/projects";
import type { Project } from "@/constants/cases/types";
import { CASE_SLIDE_SIZES, firstSlideImage } from "./case-slide";

const [project] = projects;

test("gives the first slide image with the case slide sizes", () => {
  const [
    {
      slides: [slide],
    },
  ] = project.groups;
  if (slide.kind !== "image") {
    throw new Error(
      "first slide of the first project is expected to be an image"
    );
  }
  expect(firstSlideImage(project)).toEqual({
    sizes: CASE_SLIDE_SIZES,
    src: slide.image.src,
  });
});

test("gives nothing when the first slide is text", () => {
  const textFirst: Project = {
    ...project,
    groups: [
      {
        label: "О проекте",
        slides: [{ body: null, kind: "text", tag: "Знакомство" }],
      },
    ],
  };
  expect(firstSlideImage(textFirst)).toBeUndefined();
});

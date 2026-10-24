import { expect, test } from "vitest";
import { nextProject, projects } from "./projects";

test("returns the following project", () => {
  expect(nextProject("mcoffee").slug).toBe("sfera");
  expect(nextProject("sfera").slug).toBe("gstaff");
});

test("wraps around after the last project", () => {
  expect(nextProject("gstaff")).toBe(projects[0]);
});

test("every case has groups of slides and starts with an image", () => {
  for (const project of projects) {
    expect(project.groups.length).toBeGreaterThan(0);
    for (const group of project.groups) {
      expect(group.slides.length).toBeGreaterThan(0);
    }
    // Первый слайд — превью «Следующего проекта» у предыдущего кейса.
    expect(project.groups[0].slides[0].kind).toBe("image");
  }
});

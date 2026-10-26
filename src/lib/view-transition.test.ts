import { expect, test } from "vitest";
import {
  navTypes,
  nextProjectTypes,
  pageTransition,
  projectMorph,
} from "./view-transition";

test("names the morph pair by the project slug", () => {
  expect(projectMorph("sfera").name).toBe("project-sfera");
});

// С default: "none" без share пара молча не морфится (гайд Next по view transitions).
test("morphs the pair and keeps it still in other transitions", () => {
  expect(projectMorph("sfera")).toMatchObject({
    default: "none",
    share: "project-morph",
  });
});

// Кнопки и свайпы браузера типа не несут — страница меняется без анимации.
test("animates pages only for site link navigations", () => {
  const [nav] = navTypes;
  expect(pageTransition).toMatchObject({
    default: "none",
    enter: { default: "none", [nav]: "page-enter" },
    exit: { default: "none", [nav]: "page-exit" },
  });
  expect(nextProjectTypes).toContain(nav);
});

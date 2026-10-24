import { gstaff } from "@/constants/cases/gstaff";
import { mcoffee } from "@/constants/cases/mcoffee";
import { sfera } from "@/constants/cases/sfera";
import type { Project } from "@/constants/cases/types";

// Порядок — порядок карусели на главной и «Следующего проекта».
export const projects: Project[] = [mcoffee, sfera, gstaff];

// После последнего — первый: кейсы листаются по кругу, как карусель на главной.
export function nextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

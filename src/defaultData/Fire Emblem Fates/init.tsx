import { initializeSkillClasses } from "./defaultSkills";
import { initializeClassSkills, initializeClassTree, initializeParallelClasses } from "./defaultClassData";

export function initializeData(): void {
  initializeClassSkills();
  initializeClassTree();
  initializeParallelClasses();
  initializeSkillClasses();
}
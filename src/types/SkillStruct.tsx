import { Class } from "./ClassStruct.tsx";
import { Character } from "./UnitStruct.tsx";

export enum SkillType {
  PROC = "proc",
  PASSIVE = "passive",
  UTILITY = "utility",
  SUPPORT = "support",
  DEBUFF = "debuff",
  GROWTH = "growth",
  ENEMY_PHASE = "enemy phase",
  PLAYER_PHASE = "player phase",
  OFFENSIVE = "offensive",
  DEFENSIVE = "defensive",
  AURA = "aura",
  STATS = "stats",
  RECOVERY = "recovery",
  MOVEMENT = "movement",
  MONETARY = "monetary",
}

export interface Skill {
  name: string;
  associatedClass?: Class[];
  associatedCharacter?: Character[];
  levelAcquired: number;
  description: string;
  effect: null;
  type: SkillType[];
}

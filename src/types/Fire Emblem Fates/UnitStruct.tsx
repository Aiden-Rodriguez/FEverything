export type WeaponRank = "n" | "E" | "D" | "C" | "B" | "A" | "S";
import { Class } from "./ClassStruct.tsx";
import { Skill } from "./SkillStruct.tsx";

export const conflictingPairs: Record<string, string> = {
  Robust: "Sickly",
  Strong: "Weak",
  Clever: "Dull",
  Deft: "Clumsy",
  Quick: "Slow",
  Lucky: "Unlucky",
  Sturdy: "Fragile",
  Calm: "Excitable",
};
export const boonOptions = [
  "Robust",
  "Strong",
  "Clever",
  "Deft",
  "Quick",
  "Lucky",
  "Sturdy",
  "Calm",
];
export const baneOptions = [
  "Sickly",
  "Weak",
  "Dull",
  "Clumsy",
  "Slow",
  "Unlucky",
  "Fragile",
  "Excitable",
];

export interface Character {
  name: string;
  nickname?: string;
  gender: string;
  title: string;
  royalty_status: boolean;
  class: Class;
  RouteAvailability: string;
  baseInternalLevel: number;
  level: number;
  class_line: [number, number, Class][];
  stats: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defence: number;
    resistance: number;
    move: number;
  };
  personal_skill: Skill;
  equipped_skills: Skill[];
  learned_skills: Skill[];
  weapon_ranks: {
    WeaponRankSwordKatana: WeaponRank;
    WeaponRankLanceNaginata: WeaponRank;
    WeaponRankAxeClub: WeaponRank;
    WeaponRankTomeScroll: WeaponRank;
    WeaponRankKnifeShuriken: WeaponRank;
    WeaponRankBowYumi: WeaponRank;
    WeaponRankStaffRod: WeaponRank;
    WeaponRankStone: WeaponRank;
  };
  starting_weapons: String[];

  base_growths: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defence: number;
    resistance: number;
  };
  base_class_set: {
    starting_class: Class;
    starting_class_tree: Class;
    heart_seal_classes: Class[];
    friendship_seal_partners: String[];
    partner_seal_partners: String[];
    friendship_seal_base_class: Class | null;
    partner_seal_base_class: Class | null;
  };
  boon?: string;
  bane?: string;
  maxStatModifiers: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defence: number;
    resistance: number;
  };
  // w/ no supports 5 crit avoid is always given
  personal_pair_up_bonuses_base: {
    dodge: 5;
  };
  personal_pair_up_bonuses_C: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defence: number;
    resistance: number;
  };
  personal_pair_up_bonuses_B: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defence: number;
    resistance: number;
  };
  personal_pair_up_bonuses_A: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defence: number;
    resistance: number;
  };
  personal_pair_up_bonuses_S: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defence: number;
    resistance: number;
  };
  //Always 10 hit as base w/ no supports
  support_bonus_base: {
    Crit: 0;
    CritAvoid: 0;
    Hit: 10;
    Avoid: 0;
  };
  support_bonus_C: {
    Crit: number;
    CritAvoid: number;
    Hit: number;
    Avoid: number;
  };
  support_bonus_B: {
    Crit: number;
    CritAvoid: number;
    Hit: number;
    Avoid: number;
  };
  support_bonus_A: {
    Crit: number;
    CritAvoid: number;
    Hit: number;
    Avoid: number;
  };
  support_bonus_S: {
    Crit: number;
    CritAvoid: number;
    Hit: number;
    Avoid: number;
  };
}

// Starting Equipment ..?
//Inheritable class sets (partner/friendship seals)

// Things that change game to game
// Supports - All characters
// Starting equipment, level, stats, starting skills, starting weapon rank

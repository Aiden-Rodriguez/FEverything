export type WeaponRank = "n" | "E" | "D" | "C" | "B" | "A" | "S";
import { Class } from "./ClassStruct.tsx";

export interface Character {
  name: string;
  nickname?: string;
  gender: string;
  royalty_status: boolean;
  class: Class;
  baseInternalLevel: number;
  level: number;
  stats: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
    move: number;
  };
  base_growths: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };
  personal_skill: string;
  basic_skills: {
    skill1: string;
    skill2: string;
    skill3: string;
    skill4: string;
    skill5: string;
  };
  base_class_set: {
    starting_class: Class;
    starting_class_tree: Class;
    heart_seal_classes: Class[];
    friendship_seal_partners: Character[];
    partner_seal_partners: Character[];
  };
  boon?: string;
  bane?: string;

  RouteAvailabilityBR: string;
  RouteAvailabilityCQ: string;
  RouteAvailabilityRV: string;

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

  maxStatModifiers: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };
}

// THINGS THAT UNITS SHOULD HAVE
// At base
// Starting Equipment ..?
//Stats @ Start
//Growths rate + mod for classes
//Weapon Rank
//Pers. skill
//Skills
//Base class sets
//Inheritable class sets (partner/friendship seals), Paralel classes ..?
//Personal Pair up bonuses
//Personal support bonuses
// Time(s) of reclassing / promoting

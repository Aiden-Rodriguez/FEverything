export type WeaponRank = "n" | "E" | "D" | "C" | "B" | "A" | "S";
import { Class } from "./ClassStruct.tsx";

export interface Character {
  name: string;
  nickname?: string;
  gender: string;
  title: string;
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
    friendship_seal_base_class: Class | null;
    partner_seal_base_class: Class | null;
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
    defense: number;
    resistance: number;
  };
  personal_pair_up_bonuses_B: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };
  personal_pair_up_bonuses_A: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };
  personal_pair_up_bonuses_S: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
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

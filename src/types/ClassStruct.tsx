export type WeaponRank = "n" | "E" | "D" | "C" | "B" | "A" | "S";
import { Skill } from "./SkillStruct";

export interface Class {
  className: string;
  parallelClass?: Class | null;
  description: string;
  classBaseStats: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
    move: number;

    // Only Applies to some classes
    BonusCrit: number;
    BonusCritAvoid: number;
    BonusHit: number;
    BonusAvoid: number;
  };
  classGrowths: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };

  classTree: Class[];
  promotionStatus: boolean | null;

  classSkills: Skill[];

  MaxWeaponRank: {
    WeaponRankSwordKatana: WeaponRank;
    WeaponRankLanceNaginata: WeaponRank;
    WeaponRankAxeClub: WeaponRank;
    WeaponRankTomeScroll: WeaponRank;
    WeaponRankKnifeShuriken: WeaponRank;
    WeaponRankBowYumi: WeaponRank;
    WeaponRankStaffRod: WeaponRank;
    WeaponRankStone: WeaponRank;
  };

  //This is before considering personal cap modifiers / statues
  MaxStatCaps: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };

  //before considering personal pair up modifiers
  classPairUpBonuses: {
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
    move: number;
  };

  TypeProperty: string[];

  BRExclusive?: boolean;
  CQExclusive?: boolean;
}

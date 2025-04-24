export type WeaponRank = "n" | "E" | "D" | "C" | "B" | "A" | "S";

export interface Class {
  className: string;
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

  classTree: string[];
  promotionStatus: boolean;

  classSkills: {
    Skill1: string;
    Skill1Level: number;
    Skill2: string;
    Skill2Level: number;
  };

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

  TypeProperty: string[];

  BRExclusive?: boolean;
  CQExclusive?: boolean;
}

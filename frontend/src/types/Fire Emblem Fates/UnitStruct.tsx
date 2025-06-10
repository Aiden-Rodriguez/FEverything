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

export type StatBlock = {
  hp: number;
  strength: number;
  magic: number;
  skill: number;
  speed: number;
  luck: number;
  defence: number;
  resistance: number;
};

export interface BaseCharacter {
  name: string;
  path?: string;
  nickname?: string;
  gender: string;
  title: string;
  royalty_status: boolean;
  class: Class;
  RouteAvailability: string;
  internalLevel: number;
  level: number;
  eternalSealCount: number;
  maxLevelModifier: number;
  talent?: string | null;
  class_line: [number, number, Class, StatBlock][];
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
    friendship_seal_partners: BaseCharacter[];
    partner_seal_partners: BaseCharacter[];
    selected_friendship_seal_partner: BaseCharacter | null;
    selected_partner_seal_partner: BaseCharacter | null;
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

//used for db purposes
export interface UniqueCharacterData {
  name: string;
  path: string;
  // nickname?: string;
  talent?: string;
  class: string;
  internalLevel: number;
  level: number;
  eternalSealCount: number;
  class_line: [number, number, string, StatBlock][];
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
  equipped_skills: string[];
  learned_skills: string[];
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
  weapons: String[];
  selected_friendship_seal_partner: string | null;
  selected_partner_seal_partner: string | null;
  boon?: string;
  bane?: string;
}

//used for db purposes
export const tmpCamilla: UniqueCharacterData = {
  name: "Camilla",
  path: "Conquest",
  class: "Malig Knight",
  internalLevel: 15,
  level: 14,
  eternalSealCount: 0,
  class_line: [
    [
      15,
      1,
      "Malig Knight",
      {
        hp: 10,
        strength: 11,
        magic: 10,
        skill: 0,
        speed: 0,
        luck: 0,
        defence: 0,
        resistance: 0,
      },
    ],
  ],
  stats: {
    hp: 1,
    strength: 11,
    magic: 10,
    skill: 0,
    speed: 0,
    luck: 0,
    defence: 0,
    resistance: 0,
    move: 0,
  },
  equipped_skills: ["Strength +2", "Lunge"],
  learned_skills: ["Strength +2", "Lunge"],
  weapon_ranks: {
    WeaponRankSwordKatana: "E",
    WeaponRankLanceNaginata: "E",
    WeaponRankAxeClub: "C",
    WeaponRankTomeScroll: "D",
    WeaponRankKnifeShuriken: "E",
    WeaponRankBowYumi: "E",
    WeaponRankStaffRod: "E",
    WeaponRankStone: "E",
  },
  weapons: ["Steel Axe", "Thunder"],
  selected_friendship_seal_partner: null,
  selected_partner_seal_partner: null,
};

//What really needs to be stored in db...
//boon, bane, talent (corrin)
//Name, class (just name?), internal level, level, eternal seal count, classline (just name? for classnames?), stats,
//equipped skills (just name?), weapon ranks, partner/friendship seal partners (just name?/id?)

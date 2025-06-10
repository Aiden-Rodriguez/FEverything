import { findCharacter } from "../defaultData/Fire Emblem Fates/defaultCharactersConquest";
import { BaseCharacter } from "../types/Fire Emblem Fates/UnitStruct";
import { getClass } from "../defaultData/Fire Emblem Fates/defaultClassData";
import { getSkill } from "../defaultData/Fire Emblem Fates/defaultSkills";

export function parseUnitData(units: any[]): BaseCharacter[] {
  const characterList: BaseCharacter[] = [];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const unitName = unit.name
    const characterBaseData = findCharacter(unitName)
    if (!characterBaseData) {
        throw new Error(`Unit parse failure: character not found for name "${unitName}"`);
      }
      const parsedClassLine = unit.class_line.map((entry: any[]) => {
        const updatedEntry = [...entry]; 
        updatedEntry[2] = getClass(entry[2]);
        return updatedEntry;
      });
    const parsedCharacter: BaseCharacter = {
        //user-specific data
        name: unit.name,
        path: unit.path,
        class: getClass(unit.class),
        level: unit.level,
        internalLevel: unit.internalLevel,
        eternalSealCount: unit.eternalSealCount,
        class_line: parsedClassLine,
        stats: unit.stats,
        equipped_skills: unit.equipped_skills.map(getSkill),
        learned_skills: unit.equipped_skills.map(getSkill), 
        weapon_ranks: unit.weapon_ranks,
        starting_weapons: unit.weapons,
        base_class_set: {
            starting_class: characterBaseData.base_class_set.starting_class,
            starting_class_tree: characterBaseData.base_class_set.starting_class_tree,
            heart_seal_classes: characterBaseData.base_class_set.heart_seal_classes,
            friendship_seal_partners: characterBaseData.base_class_set.friendship_seal_partners,
            partner_seal_partners: characterBaseData.base_class_set.partner_seal_partners,
            selected_friendship_seal_partner: findCharacter(unit.selected_friendship_seal_partner),
            selected_partner_seal_partner: findCharacter(unit.selected_partner_seal_partner),
            friendship_seal_base_class: characterBaseData.base_class_set.friendship_seal_base_class, //????????? is this working atp?
            partner_seal_base_class: characterBaseData.base_class_set.partner_seal_base_class, //????????? is this working atp?
        },
        boon: unit.boon,
        bane: unit.bane,
        talent: unit.talent,
        
        //non-user-specific-data
        gender: characterBaseData.gender,
        title: characterBaseData.title,
        royalty_status: characterBaseData.royalty_status,
        RouteAvailability: characterBaseData.RouteAvailability,
        maxLevelModifier: characterBaseData.maxLevelModifier,
        personal_skill: characterBaseData.personal_skill,
        base_growths: characterBaseData.base_growths,
        maxStatModifiers: characterBaseData.maxStatModifiers,
        personal_pair_up_bonuses_base: characterBaseData.personal_pair_up_bonuses_base,
        personal_pair_up_bonuses_C: characterBaseData.personal_pair_up_bonuses_C,
        personal_pair_up_bonuses_B: characterBaseData.personal_pair_up_bonuses_B,
        personal_pair_up_bonuses_A: characterBaseData.personal_pair_up_bonuses_A,
        personal_pair_up_bonuses_S: characterBaseData.personal_pair_up_bonuses_S,
        support_bonus_base: characterBaseData.support_bonus_base,
        support_bonus_C: characterBaseData.support_bonus_C,
        support_bonus_B: characterBaseData.support_bonus_B,
        support_bonus_A: characterBaseData.support_bonus_A,
        support_bonus_S: characterBaseData.support_bonus_S,
    };

    characterList.push(parsedCharacter);
  }

  return characterList;
}

// export interface BaseCharacter {
//   name: string;
//   path?: string;
//   nickname?: string;
//   gender: string;
//   title: string;
//   royalty_status: boolean;
//   class: Class;
//   RouteAvailability: string;
//   internalLevel: number;
//   level: number;
//   eternalSealCount: number;
//   maxLevelModifier: number;
//   talent?: Class | null;
//   class_line: [number, number, Class, StatBlock][];
//   stats: {
//     hp: number;
//     strength: number;
//     magic: number;
//     skill: number;
//     speed: number;
//     luck: number;
//     defence: number;
//     resistance: number;
//     move: number;
//   };
//   personal_skill: Skill;
//   equipped_skills: Skill[];
//   learned_skills: Skill[];
//   weapon_ranks: {
//     WeaponRankSwordKatana: WeaponRank;
//     WeaponRankLanceNaginata: WeaponRank;
//     WeaponRankAxeClub: WeaponRank;
//     WeaponRankTomeScroll: WeaponRank;
//     WeaponRankKnifeShuriken: WeaponRank;
//     WeaponRankBowYumi: WeaponRank;
//     WeaponRankStaffRod: WeaponRank;
//     WeaponRankStone: WeaponRank;
//   };
//   starting_weapons: String[];
//   base_growths: {
//     hp: number;
//     strength: number;
//     magic: number;
//     skill: number;
//     speed: number;
//     luck: number;
//     defence: number;
//     resistance: number;
//   };
//   base_class_set: {
//     starting_class: Class;
//     starting_class_tree: Class;
//     heart_seal_classes: Class[];
//     friendship_seal_partners: BaseCharacter[];
//     partner_seal_partners: BaseCharacter[];
//     selected_friendship_seal_partner: BaseCharacter | null;
//     selected_partner_seal_partner: BaseCharacter | null;
//     friendship_seal_base_class: Class | null;
//     partner_seal_base_class: Class | null;
//   };
//   boon?: string;
//   bane?: string;
//   maxStatModifiers: {
//     strength: number;
//     magic: number;
//     skill: number;
//     speed: number;
//     luck: number;
//     defence: number;
//     resistance: number;
//   };
//   // w/ no supports 5 crit avoid is always given
//   personal_pair_up_bonuses_base: {
//     dodge: 5;
//   };
//   personal_pair_up_bonuses_C: {
//     strength: number;
//     magic: number;
//     skill: number;
//     speed: number;
//     luck: number;
//     defence: number;
//     resistance: number;
//   };
//   personal_pair_up_bonuses_B: {
//     strength: number;
//     magic: number;
//     skill: number;
//     speed: number;
//     luck: number;
//     defence: number;
//     resistance: number;
//   };
//   personal_pair_up_bonuses_A: {
//     strength: number;
//     magic: number;
//     skill: number;
//     speed: number;
//     luck: number;
//     defence: number;
//     resistance: number;
//   };
//   personal_pair_up_bonuses_S: {
//     strength: number;
//     magic: number;
//     skill: number;
//     speed: number;
//     luck: number;
//     defence: number;
//     resistance: number;
//   };
//   //Always 10 hit as base w/ no supports
//   support_bonus_base: {
//     Crit: 0;
//     CritAvoid: 0;
//     Hit: 10;
//     Avoid: 0;
//   };
//   support_bonus_C: {
//     Crit: number;
//     CritAvoid: number;
//     Hit: number;
//     Avoid: number;
//   };
//   support_bonus_B: {
//     Crit: number;
//     CritAvoid: number;
//     Hit: number;
//     Avoid: number;
//   };
//   support_bonus_A: {
//     Crit: number;
//     CritAvoid: number;
//     Hit: number;
//     Avoid: number;
//   };
//   support_bonus_S: {
//     Crit: number;
//     CritAvoid: number;
//     Hit: number;
//     Avoid: number;
//   };
// }
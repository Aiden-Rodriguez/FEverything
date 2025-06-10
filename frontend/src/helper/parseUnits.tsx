import {
  defaultCharactersConquest,
  findCharacter,
} from "../defaultData/Fire Emblem Fates/defaultCharactersConquest";
import { BaseCharacter } from "../types/Fire Emblem Fates/UnitStruct";
import { getClass } from "../defaultData/Fire Emblem Fates/defaultClassData";
import { getSkill } from "../defaultData/Fire Emblem Fates/defaultSkills";
import { applyBoonBaneAdjustments } from "../utils/Fire Emblem Fates/characterAdjustments";
import { getAllySealClass } from "../utils/Fire Emblem Fates/getAllyClass";

export function parseUnitData(units: any[]): BaseCharacter[] {
  const characterList: BaseCharacter[] = [];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const unitName = unit.name;
    const characterBaseData = findCharacter(unitName);
    if (!characterBaseData) {
      throw new Error(
        `Unit parse failure: character not found for name "${unitName}"`,
      );
    }
    const parsedClassLine = unit.class_line.map((entry: any[]) => {
      const updatedEntry = [...entry];
      updatedEntry[2] = getClass(entry[2]);
      return updatedEntry;
    });

    const selectedFriendshipPartner = unit.selected_friendship_seal_partner
      ? findCharacter(unit.selected_friendship_seal_partner)
      : null;

    const selectedPartnerPartner = unit.selected_partner_seal_partner
      ? findCharacter(unit.selected_partner_seal_partner)
      : null;

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
        starting_class_tree:
          characterBaseData.base_class_set.starting_class_tree,
        heart_seal_classes: characterBaseData.base_class_set.heart_seal_classes,
        friendship_seal_partners:
          characterBaseData.base_class_set.friendship_seal_partners,
        partner_seal_partners:
          characterBaseData.base_class_set.partner_seal_partners,
        selected_friendship_seal_partner: findCharacter(
          unit.selected_friendship_seal_partner,
        ),
        selected_partner_seal_partner: findCharacter(
          unit.selected_partner_seal_partner,
        ),
        friendship_seal_base_class: selectedFriendshipPartner
          ? getAllySealClass(characterBaseData, selectedFriendshipPartner)
          : null,
        partner_seal_base_class: selectedPartnerPartner
          ? getAllySealClass(characterBaseData, selectedPartnerPartner)
          : null,
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
      personal_pair_up_bonuses_base:
        characterBaseData.personal_pair_up_bonuses_base,
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

    if (unitName === "Corrin (M)" || unitName === "Corrin (F)") {
      parsedCharacter.base_class_set.heart_seal_classes = [
        getClass(unit.talent),
      ];
      if (parsedCharacter.boon && parsedCharacter.bane) {
        const baseCorrin =
          unit.gender === "Male"
            ? defaultCharactersConquest[0]
            : defaultCharactersConquest[1];

        let corrin: BaseCharacter = structuredClone(baseCorrin);
        const tmpCorrin = applyBoonBaneAdjustments(
          corrin,
          parsedCharacter.boon,
          parsedCharacter.bane,
        );
        // parsedCharacter.class_line[0] = [0, 1, tmpCorrin.class, tmpCorrin.stats];
        parsedCharacter.base_growths = tmpCorrin.base_growths;
        parsedCharacter.maxStatModifiers = tmpCorrin.maxStatModifiers;
      } else {
        console.error("Corrin missing boon/bane");
      }
    }
    characterList.push(parsedCharacter);
  }

  //   console.log(characterList)
  return characterList;
}

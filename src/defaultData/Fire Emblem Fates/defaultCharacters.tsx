import { Character } from "../../types/UnitStruct.tsx";
import { defaultClassData } from "./defaultClassData.tsx";
import { Class } from "../../types/ClassStruct.tsx";

const getClass = (name: string): Class => {
  const cls = defaultClassData.find((c) => c.className === name);
  if (!cls) throw new Error(`Class ${name} not found`);
  return cls;
};

//Base stat modifiers based upon boon/bane
//HP, Magic, Skill or Luck picked as Boon/Bane: +3/-2
//Strength or Speed picked as Boon/Bane: +2/-1
//Defence or Resistance picked as Boon/Bane: +1/-1

//Growth rate modifier based on boon/bane
//Boon/Bane	HP	Str	Mag	Skl	Spd	Lck	Def	Res
//HP	      +15/-10						      +/-5+/-5
//Strength		  +15/-10		  +/-5	  +/-5
//Magic			        +20/-15	+/-5			   +/-5
//Skill		      +/-5	  +25/-20			+/-5
//Speed				          +/-5+15/-10+/-5
//Luck		      +/-5+/-5			   +25/-20
//Defence						             +/-5+10/-10+/-5
//Resistance			   +/-5		   +/-5			  +10/-10

//Max stat modifiers based on boon/bane
// Boon/Bane	Str	Mag	Skl	Spd	Lck	Def	Res
// HP	1 / -1	1 / -1			2 / -1	2 / -1	2 / -1
// Strength	4 / -3		2 / -1			2 / -1
// Magic		4 / -3		2 / -1			2 / -1
// Skill	2 / -1		4 / -3			2 / -1
// Speed			2 / -1	4 / -3	2 / -1
// Luck	2 / -1	2 / -1			4 / -3
// Defence					2 / -1	4 / -3	2 / -1
// Resistance		2 / -1		2 / -1			4 / -3

export const defaultCharacters: Character[] = [
  {
    name: "Corrin (M)",
    gender: "M",
    title: "Crux of Fate",
    class: getClass("Nohr Prince"),
    baseInternalLevel: 1,
    royalty_status: true,
    level: 1,
    stats: {
      hp: 19,
      strength: 7,
      magic: 4,
      skill: 7,
      speed: 6,
      luck: 5,
      defense: 6,
      resistance: 2,
      move: 5,
    },
    base_growths: {
      hp: 45,
      strength: 45,
      magic: 30,
      skill: 40,
      speed: 45,
      luck: 45,
      defense: 35,
      resistance: 25,
    },
    personal_skill: "Supportive",
    basic_skills: {
      skill1: "Royalty",
      skill2: "N/A",
      skill3: "N/A",
      skill4: "N/A",
      skill5: "N/A",
    },
    base_class_set: {
      starting_class: getClass("Nohr Prince"),
      starting_class_tree: getClass("Nohr Prince"),
      heart_seal_classes: [],
      friendship_seal_partners: [],
      partner_seal_partners: [],
      friendship_seal_base_class: null,
      partner_seal_base_class: null,
    },
    boon: "None selected yet",
    bane: "None selected yet",

    RouteAvailabilityBR: "Prologue",
    RouteAvailabilityCQ: "Prologue",
    RouteAvailabilityRV: "Prologue",
    weapon_ranks: {
      WeaponRankSwordKatana: "E",
      WeaponRankLanceNaginata: "n",
      WeaponRankAxeClub: "n",
      WeaponRankTomeScroll: "n",
      WeaponRankKnifeShuriken: "n",
      WeaponRankBowYumi: "n",
      WeaponRankStaffRod: "n",
      WeaponRankStone: "D",
    },

    maxStatModifiers: {
      strength: 0,
      magic: 0,
      skill: 0,
      speed: 0,
      luck: 0,
      defense: 0,
      resistance: 0,
    },
  },
  {
    name: "Corrin (F)",
    gender: "F",
    title: "Crux of Fate",
    class: getClass("Nohr Princess"),
    baseInternalLevel: 1,
    royalty_status: true,
    level: 1,
    stats: {
      hp: 19,
      strength: 7,
      magic: 4,
      skill: 7,
      speed: 6,
      luck: 5,
      defense: 6,
      resistance: 2,
      move: 5,
    },
    base_growths: {
      hp: 45,
      strength: 45,
      magic: 30,
      skill: 40,
      speed: 45,
      luck: 45,
      defense: 35,
      resistance: 25,
    },
    personal_skill: "Supportive",
    basic_skills: {
      skill1: "Royalty",
      skill2: "N/A",
      skill3: "N/A",
      skill4: "N/A",
      skill5: "N/A",
    },
    base_class_set: {
      starting_class: getClass("Nohr Princess"),
      starting_class_tree: getClass("Nohr Princess"),
      heart_seal_classes: [],
      friendship_seal_partners: [],
      partner_seal_partners: [],
      friendship_seal_base_class: null,
      partner_seal_base_class: null,
    },
    boon: "None selected yet",
    bane: "None selected yet",

    RouteAvailabilityBR: "Prologue",
    RouteAvailabilityCQ: "Prologue",
    RouteAvailabilityRV: "Prologue",

    weapon_ranks: {
      WeaponRankSwordKatana: "E",
      WeaponRankLanceNaginata: "n",
      WeaponRankAxeClub: "n",
      WeaponRankTomeScroll: "n",
      WeaponRankKnifeShuriken: "n",
      WeaponRankBowYumi: "n",
      WeaponRankStaffRod: "n",
      WeaponRankStone: "D",
    },

    maxStatModifiers: {
      strength: 0,
      magic: 0,
      skill: 0,
      speed: 0,
      luck: 0,
      defense: 0,
      resistance: 0,
    },
  },
  {
    name: "Camilla",
    gender: "F",
    title: "Bewitching Beauty",
    royalty_status: true,
    class: getClass("Malig Knight"),
    baseInternalLevel: 15,
    level: 1,
    stats: {
      hp: 30,
      strength: 19,
      magic: 11,
      skill: 15,
      speed: 19,
      luck: 12,
      defense: 18,
      resistance: 15,
      move: 8,
    },
    base_growths: {
      hp: 40,
      strength: 50,
      magic: 25,
      skill: 50,
      speed: 55,
      luck: 25,
      defense: 35,
      resistance: 45,
    },
    personal_skill: "Rose's Thorns",
    basic_skills: {
      skill1: "N/A",
      skill2: "N/A",
      skill3: "N/A",
      skill4: "N/A",
      skill5: "N/A",
    },
    base_class_set: {
      starting_class: getClass("Malig Knight"),
      starting_class_tree: getClass("Wyvern Rider"),
      heart_seal_classes: [getClass("Dark Mage")],
      friendship_seal_partners: [],
      partner_seal_partners: [],
      friendship_seal_base_class: null,
      partner_seal_base_class: null,
    },

    RouteAvailabilityBR: "",
    RouteAvailabilityCQ: "Chapter 10",
    RouteAvailabilityRV: "Chapter 12",

    weapon_ranks: {
      WeaponRankSwordKatana: "n",
      WeaponRankLanceNaginata: "n",
      WeaponRankAxeClub: "C",
      WeaponRankTomeScroll: "D",
      WeaponRankKnifeShuriken: "n",
      WeaponRankBowYumi: "n",
      WeaponRankStaffRod: "n",
      WeaponRankStone: "n",
    },

    maxStatModifiers: {
      strength: 0,
      magic: 0,
      skill: 0,
      speed: 0,
      luck: 0,
      defense: 0,
      resistance: 0,
    },
  },
];

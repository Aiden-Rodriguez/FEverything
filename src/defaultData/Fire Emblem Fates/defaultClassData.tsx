import { Class } from "../../types/ClassStruct.tsx";

export const defaultClassData: Class[] = [
  {
    className: "Nohr Prince",
    classBaseStats : {
        hp: 17,
        strength: 7,
        magic: 3,
        skill: 4,
        speed: 5,
        luck: 2,
        defense: 5,
        resistance: 2,
        move: 5,

        BonusCrit: 0,
        BonusCritAvoid: 0,
        BonusHit: 0,
        BonusAvoid: 0,
    },
    classGrowths : {
        hp: 15,
        strength: 15,
        magic: 10,
        skill: 10,
        speed: 10,
        luck: 10,
        defense: 10,
        resistance: 5,
    },

    classTree: ["Nohr Prince", "Nohr Noble", "Hoshido Noble"],
    promotionStatus: false,

    classSkills : {
        Skill1: "Nobility",
        Skill1Level: 1,
        Skill2: "Dragon Fang",
        Skill2Level: 10,
    },

    MaxWeaponRank : {
        WeaponRankSwordKatana: "B",
        WeaponRankLanceNaginata: "n",
        WeaponRankAxeClub: "n",
        WeaponRankTomeScroll: "n",
        WeaponRankKnifeShuriken: "n",
        WeaponRankBowYumi: "n",
        WeaponRankStaffRod: "n",
        WeaponRankStone: "B"
    },
    MaxStatCaps : {
        hp: 40,
        strength: 23,
        magic: 17,
        skill: 19,
        speed: 21,
        luck: 22,
        defense: 21,
        resistance: 19,
    },

    TypeProperty: ["Dragon"]
  },

  {
    className: "Nohr Princess",
    classBaseStats : {
        hp: 17,
        strength: 7,
        magic: 3,
        skill: 4,
        speed: 5,
        luck: 2,
        defense: 5,
        resistance: 2,
        move: 5,

        BonusCrit: 0,
        BonusCritAvoid: 0,
        BonusHit: 0,
        BonusAvoid: 0,
    },
    classGrowths : {
        hp: 15,
        strength: 15,
        magic: 10,
        skill: 10,
        speed: 10,
        luck: 10,
        defense: 10,
        resistance: 5,
    },

    classTree: ["Nohr Princess", "Nohr Noble", "Hoshido Noble"],
    promotionStatus: false,

    classSkills : {
        Skill1: "Nobility",
        Skill1Level: 1,
        Skill2: "Dragon Fang",
        Skill2Level: 10,
    },

    MaxWeaponRank : {
        WeaponRankSwordKatana: "B",
        WeaponRankLanceNaginata: "n",
        WeaponRankAxeClub: "n",
        WeaponRankTomeScroll: "n",
        WeaponRankKnifeShuriken: "n",
        WeaponRankBowYumi: "n",
        WeaponRankStaffRod: "n",
        WeaponRankStone: "B"
    },
    MaxStatCaps : {
        hp: 40,
        strength: 23,
        magic: 17,
        skill: 19,
        speed: 21,
        luck: 22,
        defense: 21,
        resistance: 19,
    },

    TypeProperty: ["Dragon"]
  },

  {
    className: "Malig Knight",
    classBaseStats : {
        hp: 18,
        strength: 7,
        magic: 6,
        skill: 6,
        speed: 5,
        luck: 0,
        defense: 8,
        resistance: 6,
        move: 8,

        BonusCrit: 0,
        BonusCritAvoid: 0,
        BonusHit: 0,
        BonusAvoid: 0,
    },
    classGrowths : {
        hp: 0,
        strength: 15,
        magic: 15,
        skill: 10,
        speed: 5,
        luck: 0,
        defense: 10,
        resistance: 15,
    },

    classTree: ["Wyvern Knight", "Wyvern Lord", "Malig Knight"],
    promotionStatus: true,

    classSkills : {
        Skill1: "Savage Blow",
        Skill1Level: 5,
        Skill2: "Trample",
        Skill2Level: 15,
    },

    MaxWeaponRank : {
        WeaponRankSwordKatana: "n",
        WeaponRankLanceNaginata: "n",
        WeaponRankAxeClub: "A",
        WeaponRankTomeScroll: "B",
        WeaponRankKnifeShuriken: "n",
        WeaponRankBowYumi: "n",
        WeaponRankStaffRod: "n",
        WeaponRankStone: "n"
    },
    MaxStatCaps : {
        hp: 55,
        strength: 31,
        magic: 30,
        skill: 28,
        speed: 27,
        luck: 25,
        defense: 31,
        resistance: 31,
    },

    TypeProperty: ["Dragon", "Flying"]
  },

];
import { Skill, SkillType } from "../../types/SkillStruct";
import { getClass } from "./defaultClassData";

export const defaultSkills: Skill[] = [
  {
    name: "Nobility",
    associatedClass: [],
    levelAcquired: 1,
    description: "Experience gained x 1.2",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.GROWTH],
  },
  {
    name: "Dragon Fang",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Skill x.0.75% chance of adding 50% of the user's Attack Power as damage",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Dragon Ward",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Allies adjacent to the user have a Luck x 0.5% chance of receiving half damage from enemy attacks",
    effect: null,
    type: [SkillType.PROC, SkillType.DEFENSIVE],
  },
  {
    name: "Hoshidan Unity",
    associatedClass: [],
    levelAcquired: 15,
    description: "Adds 10% to skill activation rates",
    effect: null,
    type: [SkillType.PROC, SkillType.PASSIVE],
  },
  {
    name: "Duelist's Blow",
    associatedClass: [],
    levelAcquired: 1,
    description: "When user triggers the battle, Avoid +30",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.DEFENSIVE],
  },
  {
    name: "Vantage",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "At the start of battle, when the user has under half HP, they attack first",
    effect: null,
    type: [SkillType.ENEMY_PHASE],
  },
  {
    name: "Astra",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Skill x 0.5% chance of triggering 5 consecutive hits with half damage",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Swordfaire",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user is equipped with a Sword, damage +5 during battle",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Seal Strength",
    associatedClass: [],
    levelAcquired: 5,
    description: "After battle, enemy's Strength -6",
    effect: null,
    type: [SkillType.DEBUFF, SkillType.STATS],
  },
  {
    name: "Life and Death",
    associatedClass: [],
    levelAcquired: 15,
    description: "During battles, damage +10, damage received +10",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Seal Resistance",
    associatedClass: [],
    levelAcquired: 1,
    description: "After battle, enemy's Resistance -6",
    effect: null,
    type: [SkillType.DEBUFF, SkillType.STATS],
  },
  {
    name: "Shove",
    associatedClass: [],
    levelAcquired: 10,
    description: "Select the “Shove” command to push an adjacent ally 1 tile",
    effect: null,
    type: [SkillType.UTILITY, SkillType.MOVEMENT],
  },
  {
    name: "Death Blow",
    associatedClass: [],
    levelAcquired: 5,
    description: "When user triggers the battle, Critical rate +20",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Counter",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "When an adjacent enemy triggers the battle and inflicts damage, the enemy receives the same damage",
    effect: null,
    type: [SkillType.ENEMY_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Salvage Blow",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "When user triggers the battle, Luck% chance of receiving a Katana, Naginata, Club, Yumi or Shuriken if the user defeats the enemy",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.MONETARY],
  },
  {
    name: "Lancebreaker",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Hit rate and Avoid +50 when the enemy is equipped with a Lance",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Seal Defence",
    associatedClass: [],
    levelAcquired: 1,
    description: "After battle, enemy's Defence -6",
    effect: null,
    type: [SkillType.DEBUFF, SkillType.STATS],
  },
  {
    name: "Swap",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Select the “Swap” command to swap places with an adjacent ally on the map",
    effect: null,
    type: [SkillType.UTILITY, SkillType.MOVEMENT],
  },
  {
    name: "Seal Speed",
    associatedClass: [],
    levelAcquired: 5,
    description: "After battle, enemy’s Speed -6",
    effect: null,
    type: [SkillType.DEBUFF, SkillType.STATS],
  },
  {
    name: "Lancefaire",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user is equipped with a Lance, damage +5 during battle",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Rend Heaven",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Skill x 1.5% chance of adding half the enemy's Strength (if user has a physical weapon) or Magic (if user has a magical weapon) as damage",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Quixotic",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "User and enemy's Hit rate +30 and skill activation rate +15% during battle",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Magic +2",
    associatedClass: [],
    levelAcquired: 1,
    description: "Magic +2",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Future Sight",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "When user triggers the battle, Luck% chance of gaining double experience when user defeats the enemy",
    effect: null,
    type: [SkillType.PROC, SkillType.GROWTH],
  },
  {
    name: "Rally Magic",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Magic +4 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Tomefaire",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user is equipped with a Tome, damage +5 during battle",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Miracle",
    associatedClass: [],
    levelAcquired: 1,
    description:
      "Luck% chance of leaving the user with 1 HP when they have 2 or more HP",
    effect: null,
    type: [SkillType.PROC, SkillType.DEFENSIVE],
  },
  {
    name: "Rally Luck",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Luck +8 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Renewal",
    associatedClass: [],
    levelAcquired: 5,
    description: "Recover 30% HP at the start of the user's Turn",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY],
  },
  {
    name: "Countermagic",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "When the enemy triggers the battle and inflicts magical damage, the enemy receives the same damage",
    effect: null,
    type: [SkillType.ENEMY_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Darting Blow",
    associatedClass: [],
    levelAcquired: 1,
    description: "When user triggers the battle, follow up attack speed +5",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Camaraderie",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Recover 10% HP at the start of the user's Turn if there are allies within a 2 tile radius",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY],
  },
  {
    name: "Rally Speed",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Speed +4 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Warding Blow",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user triggers the battle, magical damage received -20",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.DEFENSIVE],
  },
  {
    name: "Air Superiority",
    associatedClass: [],
    levelAcquired: 5,
    description: "Hit rate and Avoid +30 when facing Flying enemies",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Amaterasu",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Allies within a 2 tile radius recover 20% HP at the start of the user's Turn",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY, SkillType.AURA],
  },
  {
    name: "Skill +2",
    associatedClass: [],
    levelAcquired: 1,
    description: "Skill +2",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Quick Draw",
    associatedClass: [],
    levelAcquired: 10,
    description: "When user triggers the battle, damage +4",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Certain Blow",
    associatedClass: [],
    levelAcquired: 5,
    description: "When user triggers the battle, Hit rate +40",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Bowfaire",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user is equipped with a Bow, damage +5 during battle",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Locktouch",
    associatedClass: [],
    levelAcquired: 1,
    description: "User can open doors and chests without requiring keys",
    effect: null,
    type: [SkillType.UTILITY, SkillType.MONETARY],
  },
  {
    name: "Poison Strike",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "When user triggers the battle, the enemy's HP is reduced by 20% after the battle",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Lethality",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Skill x 0.25% chance of instantly defeating the enemy when dealing 1 or more damage",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Shurikenfaire",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user is equipped with a Dagger, damage +5 during battle",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Golembane",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Attacks are effective against Mechanists, Automatons and Stoneborn",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Replicate",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Select the “Replicate” command once per map to create a replica with the same appearance, stats, inventory and HP as the user (Anything that happens to the replica happens to the user and vice versa-even death)",
    effect: null,
    type: [SkillType.UTILITY, SkillType.OFFENSIVE],
  },
  {
    name: "Potent Potion",
    associatedClass: [],
    levelAcquired: 1,
    description:
      "The effect of HP recovery and stat-boosting potions is increased by 50%",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY],
  },
  {
    name: "Quick Salve",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "After consuming a HP recovery or stat-boosting potion, the user can perform another action",
    effect: null,
    type: [SkillType.UTILITY],
  },
  {
    name: "Profiteer",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Luck% chance of obtaining a Gold Bar after moving during the first seven Turns",
    effect: null,
    type: [SkillType.PROC, SkillType.MONETARY],
  },
  {
    name: "Spendthrift",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "During battles, user spends a Gold Bar for damage +10 and damage received -10",
    effect: null,
    type: [SkillType.MONETARY, SkillType.OFFENSIVE, SkillType.DEFENSIVE],
  },
  {
    name: "Evenhanded",
    associatedClass: [],
    levelAcquired: 1,
    description: "During even-numbered Turns, damage +4",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Beastbane",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "When user is a Wolfskin or Kitsune, their attacks are effective against Beast units",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Even Better",
    associatedClass: [],
    levelAcquired: 5,
    description: "Recover 40% HP at the start of even-numbered Turns",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY],
  },
  {
    name: "Grisly Wound",
    associatedClass: [],
    levelAcquired: 15,
    description: "The enemy's HP is reduced by 20% after the battle",
    effect: null,
    type: [SkillType.OFFENSIVE],
  },
  {
    name: "Luck +4",
    associatedClass: [],
    levelAcquired: 1,
    description: "Luck +4",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Inspiring Song",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Skill, Speed and Luck +3 for one Turn for the unit who receives the user's song",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Voice of Peace",
    associatedClass: [],
    levelAcquired: 25,
    description: "Enemies within a 2 tile radius deal 2 less physical damage",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.DEFENSIVE, SkillType.AURA],
  },
  {
    name: "Foreign Princess",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "“Foreign Army” enemies within a 2 tile radius deal 2 less damage and receive 2 extra damage",
    effect: null,
    type: [
      SkillType.PASSIVE,
      SkillType.DEFENSIVE,
      SkillType.OFFENSIVE,
      SkillType.AURA,
    ],
  },
  {
    name: "Aptitude",
    associatedClass: [],
    levelAcquired: 1,
    description: "Adds 10% to all growth rates during Level Ups",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.GROWTH],
  },
  {
    name: "Underdog",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Hit rate and Avoid +15 when user's Level is lower than the enemy (promoted units count as Level +20)",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Draconic Hex",
    associatedClass: [],
    levelAcquired: 5,
    description: "After battle, enemy's stats -4",
    effect: null,
    type: [SkillType.DEBUFF, SkillType.STATS],
  },
  {
    name: "Nohrian Trust",
    associatedClass: [],
    levelAcquired: 15,
    description: "User shares their support unit's battle skills",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.SUPPORT, SkillType.PROC],
  },
  {
    name: "Elbow Room",
    associatedClass: [],
    levelAcquired: 1,
    description:
      "When user fights in terrain with no terrain effects, damage +3 during battles",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Shelter",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Select the “Shelter” command to make an adjacent ally the user's support unit",
    effect: null,
    type: [SkillType.UTILITY, SkillType.MOVEMENT],
  },
  {
    name: "Defender",
    associatedClass: [],
    levelAcquired: 5,
    description: "When user is the lead unit while paired up, all stats +1",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Aegis",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Skill% chance of halving damage from Bow, Magic, Dagger, Dragonstone, Breath or Stone attacks",
    effect: null,
    type: [SkillType.PROC, SkillType.DEFENSIVE],
  },
  {
    name: "Luna",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Skill% chance of ignoring half the enemy's Defence (if user has a physical weapon) or Resistance (if user has a magical weapon)",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Armored Blow",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user triggers the battle, physical damage received -10",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.DEFENSIVE],
  },
  {
    name: "Defence +2",
    associatedClass: [],
    levelAcquired: 1,
    description: "Defence +2",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Natural Cover",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "When user fights in terrain with terrain effects, damage received -3 during battles",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.DEFENSIVE],
  },
  {
    name: "Wary Fighter",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "During battles, neither the user or enemy can perform follow up attacks",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.DEFENSIVE],
  },
  {
    name: "Pavise",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Skill% chance of halving damage from Sword, Lance, Axe, Beaststone, Claw or Puppet attacks",
    effect: null,
    type: [SkillType.PROC, SkillType.DEFENSIVE],
  },
  {
    name: "HP +5",
    associatedClass: [],
    levelAcquired: 1,
    description: "Maximum HP +5",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Gamble",
    associatedClass: [],
    levelAcquired: 10,
    description: "Hit rate -10, Critical rate +10",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Rally Strength",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Strength +4 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Axefaire",
    associatedClass: [],
    levelAcquired: 15,
    description: "When user is equipped with an Axe, damage +5 during battle",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Good Fortune",
    associatedClass: [],
    levelAcquired: 1,
    description:
      "Luck% chance of recovering 20% HP at the start of the user's Turn",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY],
  },
  {
    name: "Strong Riposte",
    associatedClass: [],
    levelAcquired: 10,
    description: "When enemy triggers the battle, damage +3",
    effect: null,
    type: [SkillType.ENEMY_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Sol",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Skill% chance of restoring half the damage dealt to the enemy",
    effect: null,
    type: [SkillType.PROC, SkillType.RECOVERY],
  },
  {
    name: "Axebreaker",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Hit rate and Avoid +50 when the enemy is equipped with an Axe",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Rally Skill",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Skill +4 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Shurikenbreaker",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Hit rate and Avoid +50 when the enemy is equipped with a Dagger",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Movement +1",
    associatedClass: [],
    levelAcquired: 10,
    description: "Movement +1",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.MOVEMENT],
  },
  {
    name: "Lucky Seven",
    associatedClass: [],
    levelAcquired: 5,
    description: "Hit rate and Avoid +20 for the first seven Turns",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Pass",
    associatedClass: [],
    levelAcquired: 15,
    description: "User can pass through tiles occupied by enemy units",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.MOVEMENT, SkillType.UTILITY],
  },
  {
    name: "Strength +2",
    associatedClass: [],
    levelAcquired: 1,
    description: "Strength +2",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Lunge",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Select the “Lunge” command to swap places with an enemy after an attack",
    effect: null,
    type: [SkillType.UTILITY, SkillType.MOVEMENT],
  },
  {
    name: "Rally Defence",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Defence +4 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Swordbreaker",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Hit rate and Avoid +50 when the enemy is equipped with a Sword",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Savage Blow",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "When user triggers the battle, enemies within a 2 tile radius have their HP reduced by 20% after the battle",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Trample",
    associatedClass: [],
    levelAcquired: 15,
    description: "Unless enemy is on a mount, damage +5",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Heartseeker",
    associatedClass: [],
    levelAcquired: 1,
    description: "When fighting adjacent to an enemy, enemy's Avoid -20",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.AURA],
  },
  {
    name: "Malefic Aura",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Enemies within a 2 tile radius receive 2 extra damage from magical attacks",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE, SkillType.AURA],
  },
  {
    name: "Vengeance",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Skill x 1.5% chance of adding half the user's (Max HP - Current HP) as damage",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Bowbreaker",
    associatedClass: [],
    levelAcquired: 15,
    description: "Hit rate and Avoid +50 when the enemy is equipped with a Bow",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Seal Magic",
    associatedClass: [],
    levelAcquired: 5,
    description: "After battle, enemy's Magic -6 *1",
    effect: null,
    type: [SkillType.DEBUFF, SkillType.STATS],
  },
  {
    name: "Lifetaker",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "When user triggers the battle, recover 50% HP after defeating the enemy",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.RECOVERY],
  },
  {
    name: "Resistance +2",
    associatedClass: [],
    levelAcquired: 1,
    description: "Resistance +2",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Gentilhomme",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Female allies within a 2 tile radius receive 2 less damage during battles",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.DEFENSIVE, SkillType.AURA],
  },
  {
    name: "Demoiselle",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Male allies within a 2 tile radius receive 2 less damage during battles",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.DEFENSIVE, SkillType.AURA],
  },
  {
    name: "Rally Resistance",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "Resistance +4 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
  {
    name: "Inspiration",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Allies within a 2 tile radius deal 2 extra damage and receive 2 less damage during battles",
    effect: null,
    type: [
      SkillType.PASSIVE,
      SkillType.OFFENSIVE,
      SkillType.DEFENSIVE,
      SkillType.AURA,
    ],
  },
  {
    name: "Live to Serve",
    associatedClass: [],
    levelAcquired: 5,
    description:
      "When healing an ally, the user recovers the same amount of HP",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY, SkillType.UTILITY],
  },
  {
    name: "Tomebreaker",
    associatedClass: [],
    levelAcquired: 15,
    description:
      "Hit rate and Avoid +50 when the enemy is equipped with a Tome",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Odd Shaped",
    associatedClass: [],
    levelAcquired: 1,
    description: "During odd-numbered Turns, damage +4",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Beastbane",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "When user is a Wolfskin or Kitsune, their attacks are effective against Beast units",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.OFFENSIVE],
  },
  {
    name: "Better Odds",
    associatedClass: [],
    levelAcquired: 5,
    description: "Recover 40% HP at the start of odd-numbered Turns",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY],
  },
  {
    name: "Even Keel",
    associatedClass: [],
    levelAcquired: 1,
    description: "During even-numbered Turns, magical damage received -4",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.DEFENSIVE],
  },
  {
    name: "Iron Will",
    associatedClass: [],
    levelAcquired: 10,
    description: "When enemy triggers the battle, magical damage received -4",
    effect: null,
    type: [SkillType.ENEMY_PHASE, SkillType.DEFENSIVE],
  },
  {
    name: "Clarity",
    associatedClass: [],
    levelAcquired: 25,
    description: "User recovers from status reduction effects twice as fast",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Aggressor",
    associatedClass: [],
    levelAcquired: 35,
    description: "When user triggers the battle, Damage +7",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE],
  },
  {
    name: "Speed +2",
    associatedClass: [],
    levelAcquired: 1,
    description: "Speed +2",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Relief",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Recover 20% HP at the start of the user's Turn if no units are within a 2 tile radius",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.RECOVERY],
  },
  {
    name: "Rally Movement",
    associatedClass: [],
    levelAcquired: 25,
    description:
      "Movement +1 to all allies within a 2 tile radius for one Turn when the “Rally” command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.MOVEMENT],
  },
  {
    name: "Galeforce",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "When user triggers the battle, allows a full action if the user defeats the enemy (once per Turn and no help from a support unit)",
    effect: null,
    type: [SkillType.PLAYER_PHASE, SkillType.OFFENSIVE, SkillType.MOVEMENT],
  },
  {
    name: "Survey",
    associatedClass: [],
    levelAcquired: 1,
    description: "When using the “Cannon” command, Hit rate +10",
    effect: null,
    type: [SkillType.UTILITY],
  },
  {
    name: "Opportunity Shot",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "When user is a Ballistician, Skill% chance of attacking an enemy within range at the start of the users Turn",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Rifled Barrel",
    associatedClass: [],
    levelAcquired: 25,
    description:
      "When using the “Cannon” command, range +1 and inner/outer range -1",
    effect: null,
    type: [SkillType.OFFENSIVE],
  },
  {
    name: "Surefooted",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "When user is a Ballistician, Movement +1 and all traversable terrain costs 1 movement point to cross",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.MOVEMENT],
  },
  {
    name: "Shadowgift",
    associatedClass: [],
    levelAcquired: 1,
    description: "User can equip Dark Mage exclusive Tomes (Nosferatu)",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Witch's Brew",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Luck% chance of obtaining a potion item (eg. Vulnerary) after moving during the first seven Turns",
    effect: null,
    type: [SkillType.PROC, SkillType.MONETARY],
  },
  {
    name: "Warp",
    associatedClass: [],
    levelAcquired: 25,
    description:
      "Select the “Warp” command to instantly move adjacent to an ally and perform another action",
    effect: null,
    type: [SkillType.UTILITY, SkillType.MOVEMENT],
  },
  {
    name: "Toxic Brew",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "When user triggers the battle, Skill x 1.5% chance of reducing the enemy's Movement to 0 and Avoid by 20 after the battle (until the next Turn)",
    effect: null,
    type: [SkillType.PROC, SkillType.DEBUFF, SkillType.PLAYER_PHASE],
  },
  {
    name: "Dancing Blade",
    associatedClass: [],
    levelAcquired: 1,
    description: "Speed +3, Defence -1",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Charm",
    associatedClass: [],
    levelAcquired: 10,
    description:
      "Allies within a 2 tile radius deal 2 extra damage during battles",
    effect: null,
    type: [
      SkillType.PASSIVE,
      SkillType.SUPPORT,
      SkillType.OFFENSIVE,
      SkillType.AURA,
    ],
  },
  {
    name: "Dual Guarder",
    associatedClass: [],
    levelAcquired: 25,
    description:
      "When user is the support unit while paired up, shield gauge gain +1",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.SUPPORT, SkillType.DEFENSIVE],
  },
  {
    name: "Speedtaker",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "When user defeats the enemy, Speed +2 (up to 10) (does not overlap with other Taker skills and expires after the chapter)",
    effect: null,
    type: [SkillType.STATS],
  },
  {
    name: "Heavy Blade",
    associatedClass: [],
    levelAcquired: 1,
    description: "Strength +3, Speed -1",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.STATS],
  },
  {
    name: "Veteran Intuition",
    associatedClass: [],
    levelAcquired: 10,
    description: "Critical Evade +15 during battles",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.DEFENSIVE],
  },
  {
    name: "Aether",
    associatedClass: [],
    levelAcquired: 25,
    description:
      "Skill x 0.5% chance of triggering a Sol hit followed by a Luna hit",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Strengthtaker",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "When user defeats the enemy, Strength +2 (up to 10) (does not overlap with other Taker skills and expires after the chapter)",
    effect: null,
    type: [SkillType.STATS],
  },
  {
    name: "Dual Striker",
    associatedClass: [],
    levelAcquired: 1,
    description:
      "When user is the support unit during Tag Team, Dual Strike damage +3",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.SUPPORT, SkillType.OFFENSIVE],
  },
  {
    name: "Awakening",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "When HP is under half, Hit rate, Avoid, Critical rate and Critical Evade +30",
    effect: null,
    type: [SkillType.PASSIVE],
  },
  {
    name: "Tactical Advice",
    associatedClass: [],
    levelAcquired: 1,
    description:
      "When user is the support unit while paired up, lead unit's Hit rate +10",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.SUPPORT],
  },
  {
    name: "Solidarity",
    associatedClass: [],
    levelAcquired: 10,
    description: "Adjacent allies receive Avoid +10 and Critical Evade +10",
    effect: null,
    type: [SkillType.PASSIVE, SkillType.SUPPORT, SkillType.AURA],
  },
  {
    name: "Ignis",
    associatedClass: [],
    levelAcquired: 25,
    description:
      "Skill% chance of adding half the user's Strength (if user has a physical weapon) or Magic (if user has a magical weapon) as damage",
    effect: null,
    type: [SkillType.PROC, SkillType.OFFENSIVE],
  },
  {
    name: "Rally Spectrum",
    associatedClass: [],
    levelAcquired: 35,
    description:
      "All Stats +2 to all allies within a 4 tile radius for one Turn when the Rally command is used",
    effect: null,
    type: [SkillType.SUPPORT, SkillType.STATS],
  },
];

// Fallback "Unknown" skill
const unknownSkill: Skill = {
  name: "Unknown",
  associatedClass: [],
  levelAcquired: 0,
  description: "Unknown skill",
  effect: null,
  type: [],
};

// Get skill by name
export function getSkill(skillName: string): Skill {
  const skill = defaultSkills.find((s) => s.name === skillName);
  if (!skill) {
    console.warn(`Skill ${skillName} not found in defaultSkills`);
    return unknownSkill;
  }
  return skill;
}

// Set associatedClass for a specific skill
export function setSkillClasses(skillName: string, classNames: string[]): void {
    const targetSkill = defaultSkills.find(s => s.name === skillName);
    if (!targetSkill) {
      console.warn(`Skill ${skillName} not found in defaultSkills`);
      return;
    }
  
    const classes = classNames
      .map(name => {
        const cls = getClass(name);
        if (cls.className === "Unknown") {
          console.warn(`Class ${name} not found for skill ${skillName}`);
        }
        return cls;
      })
      .filter(cls => cls.className !== "Unknown");
  
    targetSkill.associatedClass = classes;
  }
  
  // Initialize associatedClass for all skills
  export function initializeSkillClasses(): void {
    setSkillClasses("Nobility", ["Nohr Prince", "Nohr Princess"]);
    setSkillClasses("Dragon Fang", ["Nohr Prince", "Nohr Princess"]);
    setSkillClasses("Duelist's Blow", ["Samurai"]);
    setSkillClasses("Vantage", ["Samurai"]);
  } // NEEDS TO BE FINISHED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
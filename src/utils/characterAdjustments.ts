import { Character } from "../types/UnitStruct";

//Still needs boon/bane support and pair up bonuses...

export const applyBoonBaneAdjustments = (
  corrin: Character,
  boon: string,
  bane: string,
) => {
  // Helper function to adjust base stats
  const adjustBaseStat = (
    statKey: keyof typeof corrin.stats,
    modifier: number,
  ) => {
    corrin.stats[statKey] = (corrin.stats[statKey] || 0) + modifier;
  };

  // Helper function to adjust growth rates
  const adjustGrowthRate = (
    growthKey: keyof typeof corrin.base_growths,
    modifier: number,
  ) => {
    corrin.base_growths[growthKey] =
      (corrin.base_growths[growthKey] || 0) + modifier;
  };

  // Helper function to adjust stat caps
  const adjustStatCap = (
    capKey: keyof typeof corrin.maxStatModifiers,
    modifier: number,
  ) => {
    if (capKey in corrin.maxStatModifiers) {
      corrin.maxStatModifiers[capKey] =
        (corrin.maxStatModifiers[capKey] || 0) + modifier;
    }
  };

  switch (boon) {
    case "Robust": // Primarily boosts HP
      adjustBaseStat("hp", 3);
      adjustGrowthRate("hp", 15);
      adjustGrowthRate("defense", 5);
      adjustGrowthRate("resistance", 5);
      adjustStatCap("strength", 1);
      adjustStatCap("magic", 1);
      adjustStatCap("luck", 2);
      adjustStatCap("defense", 2);
      adjustStatCap("resistance", 2);
      break;
    case "Strong": // Primarily boosts Strength
      adjustBaseStat("strength", 2);
      adjustGrowthRate("strength", 15);
      adjustGrowthRate("skill", 5);
      adjustGrowthRate("defense", 5);
      adjustStatCap("strength", 4);
      adjustStatCap("skill", 2);
      adjustStatCap("defense", 2);
      break;
    case "Clever": // Primarily boosts Magic
      adjustBaseStat("magic", 3);
      adjustGrowthRate("magic", 20);
      adjustGrowthRate("speed", 5);
      adjustGrowthRate("resistance", 5);
      adjustStatCap("magic", 4);
      adjustStatCap("speed", 2);
      adjustStatCap("resistance", 2);
      break;
    case "Deft": // Primarily boosts Skill
      adjustBaseStat("skill", 3);
      adjustGrowthRate("skill", 25);
      adjustGrowthRate("strength", 5);
      adjustGrowthRate("defense", 5);
      adjustStatCap("skill", 4);
      adjustStatCap("strength", 2);
      adjustStatCap("defense", 2);
      break;
    case "Quick": // Primarily boosts Speed
      adjustBaseStat("speed", 2);
      adjustGrowthRate("speed", 15);
      adjustGrowthRate("skill", 5);
      adjustGrowthRate("luck", 5);
      adjustStatCap("speed", 4);
      adjustStatCap("skill", 2);
      adjustStatCap("luck", 2);
      break;
    case "Lucky": // Primarily boosts Luck
      adjustBaseStat("luck", 3);
      adjustGrowthRate("luck", 25);
      adjustGrowthRate("strength", 5);
      adjustGrowthRate("magic", 5);
      adjustStatCap("luck", 4);
      adjustStatCap("strength", 2);
      adjustStatCap("magic", 2);
      break;
    case "Sturdy": // Primarily boosts Defense
      adjustBaseStat("defense", 1);
      adjustGrowthRate("defense", 10);
      adjustGrowthRate("luck", 5);
      adjustGrowthRate("resistance", 5);
      adjustStatCap("defense", 4);
      adjustStatCap("luck", 2);
      adjustStatCap("resistance", 2);
      break;
    case "Calm": // Primarily boosts Resistance
      adjustBaseStat("resistance", 1);
      adjustGrowthRate("resistance", 10);
      adjustGrowthRate("speed", 5);
      adjustGrowthRate("magic", 5);
      adjustStatCap("resistance", 4);
      adjustStatCap("magic", 2);
      adjustStatCap("speed", 2);
      break;
  }

  switch (bane) {
    case "Sickly": // Primarily lowers HP
      adjustBaseStat("hp", -2);
      adjustGrowthRate("hp", -10);
      adjustGrowthRate("defense", -5);
      adjustGrowthRate("resistance", -5);
      adjustStatCap("strength", -1);
      adjustStatCap("magic", -1);
      adjustStatCap("luck", -1);
      adjustStatCap("defense", -1);
      adjustStatCap("resistance", -1);
      break;
    case "Weak": // Primarily lowers Strength
      adjustBaseStat("strength", -1);
      adjustGrowthRate("strength", -10);
      adjustGrowthRate("skill", -5);
      adjustGrowthRate("defense", -5);
      adjustStatCap("strength", -3);
      adjustStatCap("skill", -1);
      adjustStatCap("defense", -1);
      break;
    case "Dull": // Primarily lowers Magic
      adjustBaseStat("magic", -2);
      adjustGrowthRate("magic", -20);
      adjustGrowthRate("speed", -5);
      adjustGrowthRate("resistance", -5);
      adjustStatCap("magic", -3);
      adjustStatCap("speed", -1);
      adjustStatCap("resistance", -1);
      break;
    case "Clumsy": // Primarily lowers Skill
      adjustBaseStat("skill", -2);
      adjustGrowthRate("skill", -20);
      adjustGrowthRate("strength", -5);
      adjustGrowthRate("defense", -5);
      adjustStatCap("skill", -3);
      adjustStatCap("strength", -1);
      adjustStatCap("defense", -1);
      break;
    case "Slow": // Primarily lowers Speed
      adjustBaseStat("speed", -1);
      adjustGrowthRate("speed", -10);
      adjustGrowthRate("skill", -5);
      adjustGrowthRate("luck", -5);
      adjustStatCap("speed", -3);
      adjustStatCap("skill", -1);
      adjustStatCap("luck", -1);
      break;
    case "Unlucky": // Primarily lowers Luck
      adjustBaseStat("luck", -2);
      adjustGrowthRate("luck", -20);
      adjustGrowthRate("strength", -5);
      adjustGrowthRate("magic", -5);
      adjustStatCap("luck", -3);
      adjustStatCap("strength", -1);
      adjustStatCap("magic", -1);
      break;
    case "Fragile": // Primarily lowers Defense
      adjustBaseStat("defense", -1);
      adjustGrowthRate("defense", -10);
      adjustGrowthRate("luck", -5);
      adjustGrowthRate("resistance", -5);
      adjustStatCap("defense", -3);
      adjustStatCap("luck", -1);
      adjustStatCap("resistance", -1);
      break;
    case "Excitable": // Primarily lowers Resistance
      adjustBaseStat("resistance", -1);
      adjustGrowthRate("resistance", -10);
      adjustGrowthRate("speed", -5);
      adjustGrowthRate("magic", -5);
      adjustStatCap("resistance", -3);
      adjustStatCap("magic", -1);
      adjustStatCap("speed", -1);
      break;
  }

  return corrin;
};

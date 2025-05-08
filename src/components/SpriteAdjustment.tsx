export interface SpriteAdjustment {
  yOffsetAdjustment: number;
  xOffsetAdjustment: number;
  xOffsetOverride?: number;
  loop: boolean;
}

export function getSpriteAdjustments(
  unitClass: string,
  unitGender: string,
  frameIndex: number,
): SpriteAdjustment {
  let yOffsetAdjustment = 0;
  let xOffsetAdjustment = 0;
  let xOffsetOverride: number | undefined = undefined;
  let loop = false;
  switch (unitClass) {
    case "Malig Knight":
      if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      break;
    case "Archer":
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
        if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = -1);
      }
      break;
    case "Ballistician":
      if (frameIndex === 3) yOffsetAdjustment = 1;
      xOffsetOverride = 8;
      break;
    case "Basara":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 2);
      if (frameIndex === 1) (yOffsetAdjustment = -1), (xOffsetAdjustment = 2);
      if (frameIndex === 2) (yOffsetAdjustment = -1), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = -1), (xOffsetAdjustment = 3);
      break;
    case "Berserker":
      loop = true;
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      break;
    case "Blacksmith":
      loop = true;
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      }
      break;
    case "Butler":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      break;
    case "Bow Knight":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      break;
    case "Cavalier":
      if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 4);
      if (frameIndex === 1) (yOffsetAdjustment = 2), (xOffsetAdjustment = 4);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 4);
      if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 4);
      break;
    case "Dark Falcon":
      loop = true;
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 4);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 4);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      break;
    case "Diviner":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      break;
    case "Falcon Knight":
      loop = true;
      if (frameIndex === 0) (yOffsetAdjustment = -1), (xOffsetAdjustment = 4);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 4);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = -1), (xOffsetAdjustment = 3);
      break;
    case "Fighter":
      loop = true;
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 3), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
      }
      break;
    case "General":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -4);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -4);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = -4);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = -4);
      break;
    case "Great Lord":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 2);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 2);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 2);
      if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 2);
      break;
    case "Great Knight":
      if (frameIndex === 0) (yOffsetAdjustment = -1), (xOffsetAdjustment = 3);
      if (frameIndex === 1) (yOffsetAdjustment = -1), (xOffsetAdjustment = 3);
      if (frameIndex === 2) (yOffsetAdjustment = -1), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = -1), (xOffsetAdjustment = 3);
      break;
    case "Hero":
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 3), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 4), (xOffsetAdjustment = 1);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      }
      break;
    case "Hoshido Noble":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      break;
    case "Lodestar":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 2);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 2);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 2);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 2);
      break;
    case "Lord":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      break;
    case "Master Ninja":
      loop = true;
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 3), (xOffsetAdjustment = -3);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = -3);
        if (frameIndex === 2) (yOffsetAdjustment = 4), (xOffsetAdjustment = -3);
        if (frameIndex === 3) (yOffsetAdjustment = 4), (xOffsetAdjustment = -3);
      }
      break;
    case "Master of Arms":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      break;
    case "Mechanist":
      if (frameIndex === 0) (yOffsetAdjustment = -1), (xOffsetAdjustment = 4);
      if (frameIndex === 1) (yOffsetAdjustment = -1), (xOffsetAdjustment = 4);
      if (frameIndex === 2) (yOffsetAdjustment = -1), (xOffsetAdjustment = 4);
      if (frameIndex === 3) (yOffsetAdjustment = -1), (xOffsetAdjustment = 4);
      break;
    case "Mercenary":
      if (unitGender === "F") {
        loop = true;
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 4), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        loop = false;
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = -1);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = -1);
      }
      break;
    case "Monk":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      break;
    case "Ninja":
      if (unitGender === "F") {
        loop = true;
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        loop = false;
        if (frameIndex === 0) (yOffsetAdjustment = 3), (xOffsetAdjustment = -2);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = -2);
        if (frameIndex === 2) (yOffsetAdjustment = 4), (xOffsetAdjustment = -2);
        if (frameIndex === 3) (yOffsetAdjustment = 4), (xOffsetAdjustment = -2);
      }
      break;
    case "Nohr Noble":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      break;
    case "Nohr Prince":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      break;
    case "Nohr Princess":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      break;
    case "Oni Chieftain":
      loop = true;
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      }
      break;
    case "Oni Savage":
      loop = true;
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      }
      break;
    case "Onmyoji":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      break;
    case "Paladin":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 5);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 5);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 5);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 5);
      break;
    case "Priestess":
      if (frameIndex === 0) (yOffsetAdjustment = -1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = -1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = -1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = -1), (xOffsetAdjustment = 0);
      break;
    case "Samurai":
      if (unitGender === "F") {
        loop = true;
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      } else if (unitGender === "M") {
        loop = false;
        if (frameIndex === 0) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 4), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 5), (xOffsetAdjustment = 0);
      }
      break;
    case "Sky Knight":
      loop = true;
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 4);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 4);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      break;
    case "Sniper":
      if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      break;
    case "Spear Fighter":
      //not sure why but the looping on this one doesnt seem to line up ..?
      loop = false;
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      }
      break;
    case "Spear Master":
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
        if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      }
      break;
    case "Strategist":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 3);
      break;
    case "Swordmaster":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      break;
    case "Troubadour":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 3);
      break;
    case "Vanguard":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
      if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
      break;
    case "Villager":
      loop = true;
      if (frameIndex === 0) (yOffsetAdjustment = 3), (xOffsetAdjustment = 1);
      if (frameIndex === 1) (yOffsetAdjustment = 4), (xOffsetAdjustment = 1);
      if (frameIndex === 2) (yOffsetAdjustment = 4), (xOffsetAdjustment = 1);
      if (frameIndex === 3) (yOffsetAdjustment = 3), (xOffsetAdjustment = 1);
      break;
    case "Witch":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = -1);
      if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = -1);
      break;
    case "Wolfskin":
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 4), (xOffsetAdjustment = -2);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = -2);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = -2);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = -2);
      }
      break;
    case "Wolfssegner":
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      }
      break;
    case "Wyvern Lord":
      if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      break;
    case "Wyvern Rider":
      if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      break;
    case "Apothecary":
      if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = -2);
      if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = -2);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = -2);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = -2);
      break;
    case "Dread Fighter":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = -2);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = -2);
      if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = -2);
      if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = -2);
      break;

    case "Grandmaster":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
      break;

    case "Kinshi Knight":
      if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      break;
    case "Kitsune":
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 2);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 2);
        if (frameIndex === 2) (yOffsetAdjustment = 2), (xOffsetAdjustment = 2);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 2);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
        if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = -1);
        if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = -1);
      }
      break;
    case "Knight":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = -4);
      if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = -4);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = -4);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = -4);
      break;

    case "Merchant":
      if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 2), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 3), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 4), (xOffsetAdjustment = 0);
      break;
    case "Nine-Tails":
      if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
      if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      break;
    case "Outlaw":
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = 2), (xOffsetAdjustment = 1);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = 2), (xOffsetAdjustment = -3);
        if (frameIndex === 1) (yOffsetAdjustment = 3), (xOffsetAdjustment = -3);
        if (frameIndex === 2) (yOffsetAdjustment = 3), (xOffsetAdjustment = -3);
        if (frameIndex === 3) (yOffsetAdjustment = 3), (xOffsetAdjustment = -3);
      }
      break;
  }

  return {
    yOffsetAdjustment,
    xOffsetAdjustment,
    xOffsetOverride,
    loop,
  };
}

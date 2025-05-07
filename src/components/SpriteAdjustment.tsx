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
      if (frameIndex === 0) yOffsetAdjustment = 1;
      else if (frameIndex === 3) yOffsetAdjustment = -1;
      break;

    case "Archer":
      if (frameIndex === 3) yOffsetAdjustment = 1;
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
      if (unitGender === "F") {
        if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
        if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 0);
        if (frameIndex === 3) (yOffsetAdjustment = 1), (xOffsetAdjustment = 0);
      } else if (unitGender === "M") {
        if (frameIndex === 0) (yOffsetAdjustment = -1), (xOffsetAdjustment = 1);
        if (frameIndex === 1) (yOffsetAdjustment = -1), (xOffsetAdjustment = 1);
        if (frameIndex === 2) (yOffsetAdjustment = -2), (xOffsetAdjustment = 1);
        if (frameIndex === 3) (yOffsetAdjustment = -1), (xOffsetAdjustment = 1);
      }
      break;
      case "Blacksmith":
        if (unitGender === "F") {
          if (frameIndex === 0) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
          if (frameIndex === 1) (yOffsetAdjustment = 1), (xOffsetAdjustment = 1);
          if (frameIndex === 2) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
          if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
        } else if (unitGender === "M") {
          if (frameIndex === 0) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
          if (frameIndex === 1) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
          if (frameIndex === 2) (yOffsetAdjustment = -1), (xOffsetAdjustment = 1);
          if (frameIndex === 3) (yOffsetAdjustment = 0), (xOffsetAdjustment = 1);
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
  }

  return {
    yOffsetAdjustment,
    xOffsetAdjustment,
    xOffsetOverride,
    loop,
  };
}

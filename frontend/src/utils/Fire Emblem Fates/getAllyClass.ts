import { BaseCharacter } from "../../types/Fire Emblem Fates/UnitStruct";
import { Class } from "../../types/Fire Emblem Fates/ClassStruct";

export const getAllySealClass = (
  ClassReciever: BaseCharacter,
  ClassGiver: BaseCharacter,
): Class | null => {
  const giverBaseClass = ClassGiver.base_class_set.starting_class_tree;
  const giverHeartSealClass1 =
    ClassGiver.base_class_set.heart_seal_classes?.[0] || null;
  const recieverBaseClass = ClassReciever.base_class_set.starting_class_tree;

  const forbiddenClassShareNames = [
    "Songstress",
    "Wolfskin",
    "Kitsune",
    "Nohr Prince",
    "Nohr Princess",
    "Villager",
  ];

  if (
    forbiddenClassShareNames.includes(giverBaseClass.className) &&
    giverHeartSealClass1 &&
    recieverBaseClass.className === giverHeartSealClass1.className
  ) {
    return giverBaseClass.parallelClass ?? null;
  }

  if (
    giverBaseClass.className !== recieverBaseClass.className &&
    !forbiddenClassShareNames.includes(giverBaseClass.className)
  ) {
    return giverBaseClass;
  }

  if (
    giverHeartSealClass1 &&
    giverBaseClass.className !== giverHeartSealClass1.className
  ) {
    return giverHeartSealClass1;
  }

  return giverBaseClass.parallelClass ?? null;
};

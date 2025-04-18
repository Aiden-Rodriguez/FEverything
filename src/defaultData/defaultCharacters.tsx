import { Character } from "../types/UnitStruct.tsx";
import defaultUnit from "../assets/characters/defaultCharacter.png";

export const defaultCharacters: Character[] = [
  {
    name: "Corrin",
    class: "Nohr Prince",
    level: 5,
    stats: {
      hp: 20,
      strength: 8,
      speed: 7,
      defense: 6,
      resistance: 4,
      luck: 5,
    },
    personal_skill: "Supportive",
    basic_skills: {
        skill1: "N/A",
        skill2: "N/A",
        skill3: "N/A",
        skill4: "N/A",
        skill5: "N/A",
    },
    image: defaultUnit,
  },
  {
    name: "Camilla",
    class: "Wyvern Rider",
    level: 10,
    stats: {
      hp: 24,
      strength: 11,
      speed: 9,
      defense: 8,
      resistance: 6,
      luck: 7,
    },
    personal_skill: "Rose's Thorns",
    basic_skills: {
        skill1: "N/A",
        skill2: "N/A",
        skill3: "N/A",
        skill4: "N/A",
        skill5: "N/A",
    },
    image: defaultUnit,
  }
];

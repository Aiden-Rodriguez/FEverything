
export interface Character {
    name: string;
    class: string;
    level: number;
    stats: {
      hp: number;
      strength: number;
      speed: number;
      defense: number;
      resistance: number;
      luck: number;
    };
    personal_skill: string;
    basic_skills: {
      skill1: string;
      skill2: string;
      skill3: string;
      skill4: string;
      skill5: string;
    }
    image: string;
  }
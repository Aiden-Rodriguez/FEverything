export interface Character {
  name: string;
  nickname?: string;
  gender: string;
  royalty_status: boolean;
  class: string;
  level: number;
  stats: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };
  base_growths: {
    hp: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
  };
  personal_skill: string;
  basic_skills: {
    skill1: string;
    skill2: string;
    skill3: string;
    skill4: string;
    skill5: string;
  };
  base_class_set: {
    starting_class: string;
    starting_class_tree: string;
    heart_seal_classes: string[];
    friendship_seal_partners: Character[];
    partner_seal_partners: Character[];
  };
  image: string;
}

// THINGS THAT UNITS SHOULD HAVE
// At base
// Starting Equipment ..?
//Stats @ Start
//Growths rate + mod for classes
//Weapon Rank
//Pers. skill
//Skills
//Base class sets
//Inheritable class sets (partner/friendship seals), Paralel classes ..?
//Personal Pair up bonuses
//Personal support bonuses
// Time(s) of reclassing / promoting

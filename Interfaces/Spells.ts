export interface CharacterStatus {
    id: string;
    characterName: string;
  }
  
  export interface CharacterStatusFirestore {
    target: CharacterStatus[];
    source: CharacterStatus[];
  }
  
  export interface SpellObject {
    durationTime: number;
    durationType: string;
    effectName: string;
    effectDescription: string;
    id: string;
    characterIds: CharacterStatusFirestore;
  }
  
  export interface SpellBookObject {
    0: SpellObject[];
    1: SpellObject[];
    2: SpellObject[];
    3: SpellObject[];
    4: SpellObject[];
    5: SpellObject[];
    6: SpellObject[];
    7: SpellObject[];
    8: SpellObject[];
    9: SpellObject[];
  }
  
  export interface ServerSpellObject {
    durationTime: number;
    durationType: string;
    effectName: string;
    effectDescription: string;
    id: string;
    characterIds: CharacterStatusFirestore;
  }
  
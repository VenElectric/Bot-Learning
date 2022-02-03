export interface SessionData {
    onDeck: number;
    isSorted: boolean;
    sessionSize: number;
    initiativeList: InitiativeObject[];
    spellList: SpellObject[]
    room: string;
  }

  
export interface StatusEffect  {
    spellName: string
    id: string
    effectDescription: string
}

export interface CharacterStatus {
    characterName: string;
    characterId: string;
}
export interface InitiativeObject {
    id: string,
    characterName: string,
    initiative: number,
    initiativeModifier: number,
    roundOrder: number,
    isCurrent: boolean,
    statusEffects: StatusEffect[]
    isNpc:boolean
}

export interface RollStats {
	name: string
	roll: string
}

export interface SpellObject {
    durationTime: number;
    durationType: string;
    effectName: string;
    effectDescription: string;
    id: string;
    characterIds: CharacterStatus[][] | CharacterStatusFirestore
}

export type CharacterStatusFirestore = {target: CharacterStatus[], source: CharacterStatus[]}

export enum InitiativeObjectEnums {
    id = "id",
    characterName = "characterName",
    initiative = "initiative",
    initiativeModifier = "initiativeModifier",
    roundOrder = "roundOrder",
    isCurrent = "isCurrent",
    statusEffects = "statusEffects",
    isNpc = "isNpc",
    all = "all",
  }
  
  export enum SpellObjectEnums {
    durationTime = "durationTime",
    durationType = " durationType",
    effectName = "effectName",
    effectDescription = "effectDescription",
    id = "id",
    characterIds = "characterIds",
    all = "all",
  }
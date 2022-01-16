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

export interface InitiativeObject {
    id: string,
    characterName: string,
    initiative: number,
    initiativeModifier: number,
    roundOrder: number,
    isCurrent: boolean,
    statusEffects: StatusEffect[] | [],
    isNpc:boolean
}

export interface RollStats {
	name: string
	roll: string
}

export interface SpellObject {
    durationTime: number
    durationType: number
    effect: string
    id: string
    spellName: string
    playeridsEffected: string[]
}

interface IStatus {
    spellName: string
    id: string
    effectDescription: string
}

export interface IInit {
    id: string,
    characterName: string,
    initiative: number,
    initiativeModifier: number,
    roundOrder: number,
    isCurrent: boolean,
    statusEffects: IStatus[] | [],
    isNpc:boolean
}


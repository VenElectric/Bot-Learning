import { InitiativeObject, SpellObject } from "./GameSessionTypes";
export interface IScores {
    str?: number
    dex?: number
    con?: number
    int?: number
    wis?: number
    cha?: number
}

export interface IMovement {
    land?: string
    flight?: string
    swim?: string
}

export interface ISpells {
    name: string
}

export interface IFeats {
    name: string
    desc: string
    type?: string
    value?: string
    per_day?: string
    duration?: string

}

export interface IActions {
    name: string
    desc: string
    type_act?: string
    diff_class?: number
    save_type?: string
    use_amt?: string
}

export interface ISenses {
    sense: string
    range: string
}
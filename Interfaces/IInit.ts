
interface IStatus {
    name: string
    id: string
    effect: string
}

export interface IInit {
    id: string,
    name: string,
    init: number,
    init_mod: number,
    line_order: number,
    cmark: boolean,
    status_effects: IStatus[] | [],
    npc:boolean
}
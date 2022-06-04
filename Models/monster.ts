import {Skills} from './skills'
import {ISenses,IScores,IFeats,ISpells,IActions,IMovement} from "../Interfaces/ICommon"


interface IMonster {

    name: string
    alignment?: string
    senses?: ISenses[]
    armor_class: string
    armor_type: string
    hit_points?: number
    hit_die?: string
    movement: IMovement
    ability_scores: IScores
    saving_throws: IScores
    mon_skill: Skills
    dmg_resist?: string[]
    dmg_immune?: string[]
    condition_immune?: string[]
    languages?: string[]
    abilities: IFeats[]
    spells?: ISpells[]
    actions: IActions[]
    challenge_rating: number
}

// todo: Interfaces: lair action, spell, actions, feats, skills

interface ILegendary extends IMonster {
 legendary_actions: [{
    name: string
    desc: string
 }]
 lair_actions: string
}
import { RollObject } from "../../GameSessionTypes";
import { SkillObj } from "../Skill";
import { Alignments } from "../Alignment";

export interface MonsterAbility {
    name: string;
    id: string;
    roll: RollObject;
    effect: string;
}

export interface NPCObj {
    id: string;
    name: string;
    abilities: MonsterAbility[];
    notes: string;
    armorClass: string;
    skills: SkillObj[];
    alignment: Alignments | string;

}

export interface MonsterObj extends NPCObj {
    legendaryActions: string[];
}
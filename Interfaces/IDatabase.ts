import { IInit } from "./IInit";
import { IStatusEffect } from "./IStatusEffect";

export interface IDatabase {
    sessionId: string,
    onDeck: number,
    isSorted: boolean,
    initiativeList: IInit[] | [],
    spellsList: IStatusEffect[] | []
}
const { v4: uuidv4 } = require("uuid");
import { SpellObject } from "../Interfaces/GameSessionTypes"
import { updatecollectionRecord, addSingle } from "./database-common";
import { collectionTypes } from "../Interfaces/ServerCommunicationTypes";


export async function addSpell(sessionId: string, spell: SpellObject) {
  spell.id = uuidv4();

  let options = {
    durationTime: spell.durationTime,
    durationType: spell.durationType,
    effect: spell.effect,
    id: spell.id,
    spellName: spell.spellName,
    playeridsEffected: [],
  };

  return await addSingle(options,sessionId,collectionTypes.SPELLS)
}



export async function updateAllSpells(sessionId: string, spellList: SpellObject[]) {
  let uploadArray = [];

  for (let record of spellList) {
    let errorMsg = await updatecollectionRecord(record,collectionTypes.SPELLS,record.id,sessionId)
  
    uploadArray.push({errorMsg: errorMsg, ...record})
  }

  return uploadArray;
}

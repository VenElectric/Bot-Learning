const { v4: uuidv4 } = require("uuid");
import { ISpell } from "../Interfaces/ISpell";
import { spellCollection } from "./constants";
import { updatecollectionRecord, addSingle } from "./database-common";


export async function addSpell(sessionId: string, spell: ISpell) {
  spell.id = uuidv4();

  let options = {
    durationTime: spell.durationTime,
    durationType: spell.durationType,
    effect: spell.effect,
    id: spell.id,
    spellName: spell.spellName,
    playeridsEffected: [],
  };

  let [isUploaded, errorMsg] = await addSingle(options,sessionId,spellCollection)

  return [isUploaded, errorMsg]
}



export function updateAllSpells(sessionId: string, spellList: ISpell[]) {
  let uploadArray = [];

  for (let record of spellList) {
    let [isUploaded, errorMsg] = updatecollectionRecord(record,spellCollection,record.id,sessionId)
  
    uploadArray.push({isUploaded:isUploaded, errorMsg: errorMsg, ...record})
  }

  return uploadArray;
}




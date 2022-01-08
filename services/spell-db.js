"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllSpells = exports.addSpell = void 0;
const { v4: uuidv4 } = require("uuid");
const constants_1 = require("./constants");
const database_common_1 = require("./database-common");
function addSpell(sessionId, spell) {
    return __awaiter(this, void 0, void 0, function* () {
        spell.id = uuidv4();
        let options = {
            durationTime: spell.durationTime,
            durationType: spell.durationType,
            effect: spell.effect,
            id: spell.id,
            spellName: spell.spellName,
            playeridsEffected: [],
        };
        let [isUploaded, errorMsg] = yield (0, database_common_1.addSingle)(options, sessionId, constants_1.spellCollection);
        return [isUploaded, errorMsg];
    });
}
exports.addSpell = addSpell;
// use database delete
// export function removeSpell(sessionId: string, spellId: string) {
//   initRef
//     .doc(sessionId)
//     .collection("spells")
//     .doc(spellId)
//     .delete()
//     .then(() => {
//       // insert logging here
//       console.log("Success?");
//     })
//     .catch((error: any) => {
//       // error handling
//       console.log(error);
//     });
// }
function updateAllSpells(sessionId, spellList) {
    let uploadArray = [];
    for (let record of spellList) {
        let [isUploaded, errorMsg] = (0, database_common_1.updatecollectionRecord)(record, constants_1.spellCollection, record.id, sessionId);
        uploadArray.push(Object.assign({ isUploaded: isUploaded, errorMsg: errorMsg }, record));
    }
    return uploadArray;
}
exports.updateAllSpells = updateAllSpells;

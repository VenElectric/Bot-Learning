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
const database_common_1 = require("./database-common");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
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
        return (0, database_common_1.addSingle)(options, sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
    });
}
exports.addSpell = addSpell;
function updateAllSpells(sessionId, spellList) {
    return __awaiter(this, void 0, void 0, function* () {
        let uploadArray = [];
        for (let record of spellList) {
            let errorMsg = yield (0, database_common_1.updatecollectionRecord)(record, ServerCommunicationTypes_1.collectionTypes.SPELLS, record.id, sessionId);
            uploadArray.push(Object.assign({ errorMsg: errorMsg }, record));
        }
        return uploadArray;
    });
}
exports.updateAllSpells = updateAllSpells;

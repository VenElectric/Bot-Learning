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
exports.rollError = exports.getDiceLogs = exports.logRoll = exports.dice = void 0;
const index_1 = require("../index");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const { DiceRoller, DiceRoll } = require("@dice-roller/rpg-dice-roller");
const { Collection } = require("discord.js");
const { v4: uuidv4 } = require("uuid");
const { parseRoll } = require("../services/parse");
exports.dice = new DiceRoller();
const rollkey = ServerCommunicationTypes_1.secondLevelCollections.ROLLS;
function logRoll(diceTotal, nickname, comment, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const log = {
                name: nickname,
                roll: diceTotal,
                comment: comment,
            };
            yield index_1.redisStore.push(`${rollkey}${sessionId}`, log);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.logRoll = logRoll;
function getDiceLogs(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const rollStorage = yield index_1.redisStore.retrieveArray(`${rollkey}${sessionId}`);
        return rollStorage;
    });
}
exports.getDiceLogs = getDiceLogs;
function rollError(fn) {
    return (rollString) => {
        try {
            const roll = fn.call(null, rollString);
            return roll;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    };
}
exports.rollError = rollError;

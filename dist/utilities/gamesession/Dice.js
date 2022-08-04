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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../../data/firestore/DataBase"));
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const index_1 = require("../../index");
const { DiceRoller, DiceRoll } = require("@dice-roller/rpg-dice-roller");
class DiceHandler extends DataBase_1.default {
    constructor(sonic) {
        super(sonic);
        this.topLevel = ServerCommunicationTypes_1.topLevelCollections.SESSIONS;
        this.secondLevel = ServerCommunicationTypes_1.secondLevelCollections.ROLLS;
        this.dice = new DiceRoller();
    }
    logRoll(diceTotal, nickname, comment, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dicelog = {
                    name: nickname,
                    roll: diceTotal,
                    comment: comment,
                };
                this.log("adding dice log to redis", this.info, this.logRoll.name, ...arguments);
                yield index_1.redisStore.push(`${this.secondLevel}${sessionId}`, dicelog);
            }
            catch (error) {
                this.onError(error, this.logRoll.name, ...arguments);
            }
        });
    }
    getDiceLogs(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rollStorage = yield index_1.redisStore.retrieveArray(`${this.secondLevel}${sessionId}`);
            return rollStorage;
        });
    }
    roll(roll) {
        try {
            return this.dice.roll(roll);
        }
        catch (error) {
            this.onError(error, this.roll.name, arguments);
            return undefined;
        }
    }
    isValidRoll(roll) {
        try {
            const rollTest = this.dice.roll(roll);
            this.log("returning true for dice", this.debug, this.isValidRoll.name);
            return true;
        }
        catch (error) {
            this.log("returning false for dice", this.debug, this.isValidRoll.name);
            return false;
        }
    }
}
exports.default = DiceHandler;

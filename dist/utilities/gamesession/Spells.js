"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBase_1 = __importDefault(require("../../data/firestore/DataBase"));
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
class Spell extends DataBase_1.default {
    constructor(sonic) {
        super(sonic);
        this.topLevel = ServerCommunicationTypes_1.topLevelCollections.SESSIONS;
        this.secondLevel = ServerCommunicationTypes_1.secondLevelCollections.SPELLS;
    }
}
exports.default = Spell;

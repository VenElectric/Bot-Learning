"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInitiativeObject = void 0;
const { v4: uuidv4 } = require("uuid");
function generateInitiativeObject(name, initiative, modifier, isNpc) {
    return {
        id: uuidv4(),
        characterName: name,
        initiative: initiative + modifier,
        initiativeModifier: modifier,
        roundOrder: 0,
        isCurrent: false,
        statusEffects: [],
        isNpc: isNpc,
    };
}
exports.generateInitiativeObject = generateInitiativeObject;

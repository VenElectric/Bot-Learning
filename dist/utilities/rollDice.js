"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoll = void 0;
const { DiceRoller } = require("@dice-roller/rpg-dice-roller");
const rollStorage = new DiceRoller();
function getRoll(rollString) {
    return rollStorage.roll(rollString);
}
exports.getRoll = getRoll;

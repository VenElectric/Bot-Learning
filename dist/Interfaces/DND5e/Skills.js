"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsList = void 0;
var AbilityAbbr;
(function (AbilityAbbr) {
    AbilityAbbr["str"] = "str";
    AbilityAbbr["dex"] = "dex";
    AbilityAbbr["con"] = "con";
    AbilityAbbr["int"] = "int";
    AbilityAbbr["wis"] = "wis";
    AbilityAbbr["cha"] = "cha";
})(AbilityAbbr || (AbilityAbbr = {}));
exports.SkillsList = {
    acrobatics: { name: "Acrobatics", ability: AbilityAbbr.dex },
    animal_handling: { name: "Animal Handling", ability: AbilityAbbr.wis },
    arcana: { name: "Arcana", ability: AbilityAbbr.int },
    athletics: { name: "Athletics", ability: AbilityAbbr.str },
    deception: { name: "Deception", ability: AbilityAbbr.cha },
    history: { name: "History", ability: AbilityAbbr.int },
    insight: { name: "Insight", ability: AbilityAbbr.wis },
    intimidation: { name: "Intimidation", ability: AbilityAbbr.cha },
    investigation: { name: "Investigation", ability: AbilityAbbr.int },
    medicine: { name: "Medicine", ability: AbilityAbbr.wis },
    nature: { name: "Nature", ability: AbilityAbbr.int },
    perception: { name: "Perception", ability: AbilityAbbr.wis },
    performance: { name: "Performance", ability: AbilityAbbr.cha },
    persuasion: { name: "Persuasion", ability: AbilityAbbr.cha },
    religion: { name: "Religion", ability: AbilityAbbr.int },
    sleight_of_hand: { name: "Sleight of Hand", ability: AbilityAbbr.dex },
    stealth: { name: "Stealth", ability: AbilityAbbr.dex },
    survival: { name: "Survival", ability: AbilityAbbr.wis },
};

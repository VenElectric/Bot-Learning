"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellContextEnums = exports.InitiativeContextEnums = exports.collectionTypes = exports.EmitTypes = void 0;
var EmitTypes;
(function (EmitTypes) {
    EmitTypes["GET_INITIAL"] = "GET_INITIAL";
    EmitTypes["NEXT"] = "NEXT";
    EmitTypes["PREVIOUS"] = "PREVIOUS";
    EmitTypes["ROUND_START"] = "ROUND_START";
    EmitTypes["UPDATE_ONE"] = "UPDATE_ONE";
    EmitTypes["UPDATE_ALL"] = "UPDATE_ALL";
    EmitTypes["DELETE_ONE"] = "DELETE_ONE";
    EmitTypes["DELETE_ALL"] = "DELETE_ALL";
    EmitTypes["CREATE_NEW"] = "CREATE_NEW";
    EmitTypes["RE_ROLL"] = "RE_ROLL";
    EmitTypes["RESORT"] = "RESORT";
    EmitTypes["DISCORD"] = "DISCORD";
    EmitTypes["REMOVE_STATUS_EFFECT"] = "REMOVE_STATUS_EFFECT";
    EmitTypes["ADD_STATUS_EFFECT"] = "ADD_STATUS_EFFECT";
})(EmitTypes = exports.EmitTypes || (exports.EmitTypes = {}));
var collectionTypes;
(function (collectionTypes) {
    collectionTypes["INITIATIVE"] = "initiative";
    collectionTypes["SPELLS"] = "spells";
    collectionTypes["LOGGING"] = "logging";
})(collectionTypes = exports.collectionTypes || (exports.collectionTypes = {}));
var InitiativeContextEnums;
(function (InitiativeContextEnums) {
    InitiativeContextEnums["INITIAL_INIT"] = "INITIAL_INIT";
    InitiativeContextEnums["ADD_INITIATIVE"] = "ADD_INITIATIVE";
    InitiativeContextEnums["UPDATE_INITIATIVE"] = "UPDATE_INITIATIVE";
    InitiativeContextEnums["INITIATITVE_LIST"] = "INITIATITVE_LIST";
    InitiativeContextEnums["NEXT"] = "NEXT";
    InitiativeContextEnums["PREVIOUS"] = "PREVIOUS";
    InitiativeContextEnums["RE_ROLL"] = "RE_ROLL";
    InitiativeContextEnums["DISCORD_INITIATIVE"] = "DISCORD_INITIATIVE";
    InitiativeContextEnums["RESORT"] = "RESORT";
    InitiativeContextEnums["UPDATE_ORDER"] = "UPDATE_ORDER";
    InitiativeContextEnums["REMOVE_STATUS_EFFECT"] = "REMOVE_STATUS_EFFECT";
    InitiativeContextEnums["SET_CURRENT_TURN"] = "SET_CURRENT_TURN";
    InitiativeContextEnums["ADD_STATUS_EFFECT"] = "ADD_STATUS_EFFECT";
    InitiativeContextEnums["DELETE_INITIATIVE"] = "DELETE_INITIATIVE";
    InitiativeContextEnums["ROUND_START"] = "ROUND_START";
})(InitiativeContextEnums = exports.InitiativeContextEnums || (exports.InitiativeContextEnums = {}));
var SpellContextEnums;
(function (SpellContextEnums) {
    SpellContextEnums["INITIAL_SPELLS"] = "INITIAL_SPELLS";
})(SpellContextEnums = exports.SpellContextEnums || (exports.SpellContextEnums = {}));
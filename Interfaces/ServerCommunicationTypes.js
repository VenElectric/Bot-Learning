"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellContextEnums = exports.InitiativeContextEnums = exports.collectionTypes = exports.EmitTypes = void 0;
var EmitTypes;
(function (EmitTypes) {
    EmitTypes["GET_INITIAL"] = "GET_INITIAL";
    EmitTypes["GET_SPELLS"] = "GET_SPELLS";
    EmitTypes["NEXT"] = "NEXT";
    EmitTypes["PREVIOUS"] = "PREVIOUS";
    EmitTypes["ROUND_START"] = "ROUND_START";
    EmitTypes["GET_INITIAL_ROLLS"] = "GET_INITIAL_ROLLS";
    EmitTypes["CREATE_NEW_ROLL"] = "CREATE_NEW_ROLL";
    EmitTypes["UPDATE_ROLL_RECORD"] = "UPDATE_ROLL_RECORD";
    EmitTypes["DELETE_ONE_ROLL"] = "DELETE_ONE_ROLL";
    EmitTypes["UPDATE_ALL_INITIATIVE"] = "UPDATE_ALL_INITIATIVE";
    EmitTypes["DELETE_ONE_INITIATIVE"] = "DELETE_ONE_INITIATIVE";
    EmitTypes["DELETE_ALL_INITIATIVE"] = "DELETE_ALL_INITIATIVE";
    EmitTypes["CREATE_NEW_INITIATIVE"] = "CREATE_NEW_INITIATIVE";
    EmitTypes["UPDATE_ITEM_INITIATIVE"] = "UPDATE_ITEM_INITIATIVE";
    EmitTypes["UPDATE_RECORD_INITIATIVE"] = "UPDATE_RECORD_INITIATIVE";
    EmitTypes["UPDATE_ALL_SPELL"] = "UPDATE_ALL_SPELL";
    EmitTypes["DELETE_ONE_SPELL"] = "DELETE_ONE_SPELL";
    EmitTypes["DELETE_ALL_SPELL"] = "DELETE_ALL_SPELL";
    EmitTypes["CREATE_NEW_SPELL"] = "CREATE_NEW_SPELL";
    EmitTypes["UPDATE_ITEM_SPELL"] = "UPDATE_ITEM_SPELL";
    EmitTypes["UPDATE_RECORD_SPELL"] = "UPDATE_RECORD_SPELL";
    EmitTypes["UPDATE_SESSION"] = "UPDATE_SESSION";
    EmitTypes["RE_ROLL"] = "RE_ROLL";
    EmitTypes["RESORT"] = "RESORT";
    EmitTypes["DISCORD"] = "DISCORD";
    EmitTypes["DISCORD_ROLL"] = "DISCORD_ROLL";
    EmitTypes["REMOVE_STATUS_EFFECT"] = "REMOVE_STATUS_EFFECT";
    EmitTypes["ADD_STATUS_EFFECT"] = "ADD_STATUS_EFFECT";
})(EmitTypes = exports.EmitTypes || (exports.EmitTypes = {}));
var collectionTypes;
(function (collectionTypes) {
    collectionTypes["INITIATIVE"] = "initiative";
    collectionTypes["SPELLS"] = "spells";
    collectionTypes["LOGGING"] = "logging";
    collectionTypes["ROLLS"] = "rolls";
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

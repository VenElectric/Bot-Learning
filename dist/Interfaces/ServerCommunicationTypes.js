"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topLevelCollections = exports.secondLevelCollections = exports.collectionTypes = exports.EmitTypes = void 0;
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
    EmitTypes["DISCORD_INITIATIVE"] = "DISCORD_INITIATIVE";
    EmitTypes["DISCORD_SPELLS"] = "DISCORD_SPELLS";
    EmitTypes["RESET_ONDECK"] = "RESET_ONDECK";
})(EmitTypes = exports.EmitTypes || (exports.EmitTypes = {}));
var collectionTypes;
(function (collectionTypes) {
    collectionTypes["INITIATIVE"] = "initiative";
    collectionTypes["SPELLS"] = "spells";
    collectionTypes["LOGGING"] = "logging";
    collectionTypes["ROLLS"] = "rolls";
})(collectionTypes = exports.collectionTypes || (exports.collectionTypes = {}));
// todo: rename collectionTypes in all files to secondLevelCollections
var secondLevelCollections;
(function (secondLevelCollections) {
    secondLevelCollections["INITIATIVE"] = "initiative";
    secondLevelCollections["SPELLS"] = "spells";
    secondLevelCollections["LOGGING"] = "logging";
    secondLevelCollections["ROLLS"] = "rolls";
    secondLevelCollections["CHARACTERS"] = "characters";
})(secondLevelCollections = exports.secondLevelCollections || (exports.secondLevelCollections = {}));
var topLevelCollections;
(function (topLevelCollections) {
    topLevelCollections["USERS"] = "users";
    topLevelCollections["SESSIONS"] = "sessions";
})(topLevelCollections = exports.topLevelCollections || (exports.topLevelCollections = {}));

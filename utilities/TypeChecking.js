"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDoubleArray = exports.collectionequalsObject = exports.isSpellObjectArray = exports.isInitiativeObjectArray = exports.isSpellObject = exports.isInitiativeObject = exports.isSessionData = void 0;
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
function isSessionData(payload) {
    if (payload) {
        return true;
    }
    else {
        return false;
    }
}
exports.isSessionData = isSessionData;
function isInitiativeObject(payload) {
    if (payload) {
        return true;
    }
    else {
        return false;
    }
}
exports.isInitiativeObject = isInitiativeObject;
function isSpellObject(payload) {
    if (payload) {
        return true;
    }
    else {
        return false;
    }
}
exports.isSpellObject = isSpellObject;
function isInitiativeObjectArray(payload) {
    if (payload) {
        return true;
    }
    else {
        return false;
    }
}
exports.isInitiativeObjectArray = isInitiativeObjectArray;
function isSpellObjectArray(payload) {
    if (payload) {
        return true;
    }
    else {
        return false;
    }
}
exports.isSpellObjectArray = isSpellObjectArray;
function collectionequalsObject(collection, item) {
    if (collection === ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
        return isInitiativeObject(item);
    }
    if (collection === ServerCommunicationTypes_1.collectionTypes.SPELLS) {
        return isSpellObject(item);
    }
}
exports.collectionequalsObject = collectionequalsObject;
function isDoubleArray(payload) {
    if (payload) {
        return true;
    }
    else {
        return false;
    }
}
exports.isDoubleArray = isDoubleArray;

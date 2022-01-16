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
exports.getSession = exports.updateSession = exports.retrieveCollection = exports.updatecollectionRecord = exports.updateCollectionItem = exports.deleteSingle = exports.addSingle = void 0;
//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
const LoggingClass_1 = require("../utilities/LoggingClass");
const chalk_1 = __importDefault(require("chalk"));
function addSingle(item, sessionId, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorMsg;
        // check if doc exists
        initRef
            .doc(sessionId)
            .collection(collection)
            .doc(item.id)
            .set(item)
            .then(() => {
            errorMsg = false;
            LoggingClass_1.weapon_of_logging.INFO("isUploaded", "added single upload", item);
        })
            .catch((error) => {
            // error handling
            console.trace(error);
            if (error instanceof Error) {
                LoggingClass_1.weapon_of_logging.CRITICAL(error.name, error.message, error.stack, { item: item, collectionType: collection });
            }
            errorMsg = error;
        });
        return Promise.resolve(errorMsg);
    });
}
exports.addSingle = addSingle;
function deleteSingle(itemId, sessionId, collection) {
    // check if doc exists
    let errorMsg;
    initRef
        .doc(sessionId)
        .collection(collection)
        .doc(itemId)
        .delete()
        .then(() => {
        errorMsg = false;
        LoggingClass_1.weapon_of_logging.INFO("isDeleted", "success deletion", itemId);
    })
        .catch((error) => {
        if (error instanceof Error) {
            errorMsg = error;
            LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, { itemId: itemId, collectionType: collection });
        }
    });
    return Promise.resolve(errorMsg);
}
exports.deleteSingle = deleteSingle;
function updateCollectionItem(value, collection, docId, sessionId, valueName) {
    try {
        LoggingClass_1.weapon_of_logging.DEBUG("updatecollectionitem", "initial data", { value, collection, docId, sessionId });
        initRef.doc(sessionId)
            .collection(collection)
            .doc(docId)
            .set({ [valueName]: value }, { merge: true })
            .then(() => {
            LoggingClass_1.weapon_of_logging.DEBUG("updatecollectionitem", `successfully updated ${valueName} in ${collection}`, value);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            LoggingClass_1.weapon_of_logging.DEBUG("updateCollectionitem", error.message, value);
        }
    }
}
exports.updateCollectionItem = updateCollectionItem;
function updatecollectionRecord(
// check if doc/collection exists
item, collection, docId, sessionId) {
    let errorMsg;
    initRef
        .doc(sessionId)
        .collection(collection)
        .doc(docId)
        .set(item, { merge: true })
        .then(() => {
        LoggingClass_1.weapon_of_logging.INFO("updateCollectionRecord", `success updating collection ${collection}`, { item: item, docId: docId, collection: collection });
        errorMsg = false;
    })
        .catch((error) => {
        if (error instanceof Error) {
            LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, { item: item, docId: docId, collectionType: collection });
        }
        errorMsg = error;
    });
    return Promise.resolve(errorMsg);
}
exports.updatecollectionRecord = updatecollectionRecord;
function retrieveCollection(sessionId, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let databaseList = [];
        console.info(sessionId);
        console.info(collection);
        try {
            let snapshot = yield initRef.doc(sessionId).collection(collection).get();
            if (snapshot.docs !== undefined) {
                snapshot.forEach((doc) => {
                    databaseList.push(Object.assign({}, doc.data()));
                });
                // logging
            }
            if (snapshot.docs === undefined) {
                LoggingClass_1.weapon_of_logging.DEBUG("retrievecollection", "snapshot is undefined", "none");
                // weapon_of_logging.NOTICE("snapshot.docs === undefined","none",collection,sessionId)
                // throw ReferenceError(`snapshot.docs is undefined sessionId: ${sessionId} collection: ${collection}`); 
            }
        }
        catch (error) {
            console.log(chalk_1.default.bgGreenBright(sessionId));
            console.log(chalk_1.default.bgGreenBright(collection));
            console.log(error);
        }
        // weapon_of_logging.INFO("retrieveCollection", "complete",databaseList,sessionId)
        return Promise.resolve(databaseList);
    });
}
exports.retrieveCollection = retrieveCollection;
function updateSession(sessionId, onDeck, isSorted, sessionSize) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorMsg;
        // check if doc exists
        try {
            initRef.doc(sessionId).set({ onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize }, { merge: true });
            errorMsg = false;
        }
        catch (error) {
            if (error instanceof Error) {
                errorMsg = error.message;
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize });
                }
            }
        }
        return Promise.resolve(errorMsg);
    });
}
exports.updateSession = updateSession;
function getSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if doc + items exist
        let snapshot = yield initRef.doc(sessionId).get();
        //@ts-ignore
        let isSorted;
        //@ts-ignore
        let onDeck;
        //@ts-ignore
        let sessionSize;
        try {
            if (snapshot.data() != undefined) {
                isSorted = snapshot.data().isSorted;
                onDeck = snapshot.data().onDeck;
                sessionSize = snapshot.data().sessionSize;
                LoggingClass_1.weapon_of_logging.DEBUG("getSession", "grabbingSessionData", { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize });
            }
            else {
                initRef.doc(sessionId).set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true }).then(() => { LoggingClass_1.weapon_of_logging.INFO("getSession", "setting session data success", null); }).catch((error) => {
                    if (error instanceof Error) {
                        LoggingClass_1.weapon_of_logging.DEBUG("getSession", "grabbingSessionData", "failed to get session data for some reason.");
                        LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, 
                        //@ts-ignore
                        { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize });
                        isSorted = false;
                        onDeck = 0;
                        sessionSize = 0;
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, "none");
            }
        }
        return Promise.resolve([isSorted, onDeck, sessionSize]);
    });
}
exports.getSession = getSession;

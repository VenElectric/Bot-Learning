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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = exports.updateSession = exports.retrieveCollection = exports.updatecollectionRecord = exports.updateCollectionItem = exports.deleteSingle = exports.addSingle = void 0;
//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
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
            weapon_of_logging.info({ message: `added item to collection ${collection}`, function: "addSingle" });
        })
            .catch((error) => {
            // error handling
            console.trace(error);
            if (error instanceof Error) {
                weapon_of_logging.alert({ message: error.message, function: "addSingle" });
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
        weapon_of_logging.info({ message: `successfully deleted from ${collection}`, function: "deleteSingle" });
    })
        .catch((error) => {
        if (error instanceof Error) {
            errorMsg = error;
            weapon_of_logging.alert({ message: error.message, function: "deleteSingle" });
        }
    });
    return Promise.resolve(errorMsg);
}
exports.deleteSingle = deleteSingle;
function updateCollectionItem(value, collection, docId, sessionId, valueName) {
    try {
        weapon_of_logging.debug({ message: { docId, collection, value, valueName }, function: "deleteSingle" });
        initRef.doc(sessionId)
            .collection(collection)
            .doc(docId)
            .set({ [valueName]: value }, { merge: true })
            .then(() => {
            weapon_of_logging.info({ message: `successfully updated ${valueName} in ${collection}`, function: "updateCollection" });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            weapon_of_logging.alert({ message: error.message, function: "updateCollection" });
        }
    }
}
exports.updateCollectionItem = updateCollectionItem;
function updatecollectionRecord(
// check if doc/collection exists
item, collection, docId, sessionId) {
    let errorMsg;
    weapon_of_logging.debug({ message: { docId, collection }, function: "updateCollectionRecord" });
    initRef
        .doc(sessionId)
        .collection(collection)
        .doc(docId)
        .set(item, { merge: true })
        .then(() => {
        weapon_of_logging.info({ message: `success updating collection ${collection}`, function: "updateCollectionRecord" });
        errorMsg = false;
    })
        .catch((error) => {
        if (error instanceof Error) {
            weapon_of_logging.alert({ message: error.message, function: "updateCollectionRecord" });
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
                weapon_of_logging.warning({ message: "snapshot.docs is undefined", function: "retrieveCollection" });
                // weapon_of_logging.warning("snapshot.docs === undefined","none",collection,sessionId)
                // throw ReferenceError(`snapshot.docs is undefined sessionId: ${sessionId} collection: ${collection}`); 
            }
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({ message: error.message, function: "updateCollectionRecord" });
            }
        }
        weapon_of_logging.info({ message: "collection retrieved", function: "retrieveCollection" });
        // weapon_of_logging.info("retrieveCollection", "complete",databaseList,sessionId)
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
                    weapon_of_logging.alert({ message: error.message, function: "updatesession" });
                }
            }
        }
        weapon_of_logging.info({ message: "updateSession set", function: "updatesession" });
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
                weapon_of_logging.debug({ message: "snapshot.data is not undefined", function: "getSession" });
            }
            else {
                initRef.doc(sessionId).set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true }).then(() => { weapon_of_logging.info({ message: "setting session data success", function: "getSession" }); }).catch((error) => {
                    if (error instanceof Error) {
                        weapon_of_logging.alert({ message: error.message, function: "updatesession" });
                        isSorted = false;
                        onDeck = 0;
                        sessionSize = 0;
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({ message: error.message, function: "updatesession" });
            }
        }
        return Promise.resolve([isSorted, onDeck, sessionSize]);
    });
}
exports.getSession = getSession;

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
exports.deleteCollection = exports.deleteSession = exports.getSession = exports.updateSession = exports.retrieveRecord = exports.retrieveCollection = exports.updatecollectionRecord = exports.updateCollection = exports.updateCollectionItem = exports.deleteSingle = exports.addSingle = exports.separateArrays = void 0;
//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
function separateArrays(characterIds) {
    return { target: characterIds[1], source: characterIds[0] };
}
exports.separateArrays = separateArrays;
function addSingle(item, sessionId, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorMsg;
        initRef
            .doc(sessionId)
            .collection(collection)
            .doc(item.id)
            .set(item)
            .then(() => {
            errorMsg = false;
            weapon_of_logging.info({
                message: `added item to collection ${collection}`,
                function: "addSingle",
            });
        })
            .catch((error) => {
            // error handling
            console.trace(error);
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "addSingle",
                });
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
        weapon_of_logging.info({
            message: `successfully deleted from ${collection}`,
            function: "deleteSingle",
        });
    })
        .catch((error) => {
        if (error instanceof Error) {
            errorMsg = error;
            weapon_of_logging.alert({
                message: error.message,
                function: "deleteSingle",
            });
        }
    });
    return Promise.resolve(errorMsg);
}
exports.deleteSingle = deleteSingle;
function updateCollectionItem(value, collection, docId, sessionId, valueName) {
    try {
        weapon_of_logging.debug({
            message: { docId, collection, value, valueName },
            function: "updateCollectionItem",
        });
        initRef
            .doc(sessionId)
            .collection(collection)
            .doc(docId)
            .set({ [valueName]: value }, { merge: true })
            .then(() => {
            weapon_of_logging.info({
                message: `successfully updated ${valueName} in ${collection}`,
                function: "updateCollection",
            });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            weapon_of_logging.alert({
                message: error.message,
                function: "updateCollection",
            });
        }
    }
}
exports.updateCollectionItem = updateCollectionItem;
function updateCollection(sessionId, collectionType, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const docRef = db
                .collection("sessions")
                .doc(sessionId)
                .collection(collectionType);
            const batch = db.batch();
            for (const record of payload) {
                const recordRef = docRef.doc(record.id);
                batch.set(recordRef, record);
            }
            yield batch.commit();
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: `updateCollection ${collectionType} ${payload[0].id}`,
                });
            }
        }
    });
}
exports.updateCollection = updateCollection;
function updatecollectionRecord(
// check if doc/collection exists
item, collection, docId, sessionId) {
    let errorMsg;
    weapon_of_logging.debug({
        message: { docId, collection },
        function: "updateCollectionRecord",
    });
    initRef
        .doc(sessionId)
        .collection(collection)
        .doc(docId)
        .set(item, { merge: true })
        .then(() => {
        weapon_of_logging.info({
            message: `success updating collection ${collection}`,
            function: "updateCollectionRecord",
        });
        errorMsg = false;
    })
        .catch((error) => {
        if (error instanceof Error) {
            weapon_of_logging.alert({
                message: error.message,
                function: "updateCollectionRecord",
            });
        }
        errorMsg = error;
    });
    return Promise.resolve(errorMsg);
}
exports.updatecollectionRecord = updatecollectionRecord;
function retrieveCollection(sessionId, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let databaseList = [];
        try {
            let snapshot = yield initRef.doc(sessionId).collection(collection).get();
            if (snapshot.docs !== undefined) {
                snapshot.forEach((doc) => {
                    databaseList.push(Object.assign({}, doc.data()));
                });
                // logging
            }
            if (snapshot.docs === undefined) {
                weapon_of_logging.warning({
                    message: "snapshot.docs is undefined",
                    function: "retrieveCollection",
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "updateCollectionRecord",
                });
            }
        }
        weapon_of_logging.info({
            message: "collection retrieved",
            function: "retrieveCollection",
        });
        // weapon_of_logging.info("retrieveCollection", "complete",databaseList,sessionId)
        return Promise.resolve(databaseList);
    });
}
exports.retrieveCollection = retrieveCollection;
function retrieveRecord(docId, sessionId, collectionType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const record = yield initRef
                .doc(sessionId)
                .collection(collectionType.toLowerCase())
                .doc(docId)
                .get();
            weapon_of_logging.debug({
                message: record.data().id,
                function: "retrieveRecord",
            });
            return record.data();
        }
        catch (error) {
            weapon_of_logging.alert({
                message: `Could not find collection item: ${docId} Type: ${collectionType}`,
                function: "getRecord",
            });
        }
    });
}
exports.retrieveRecord = retrieveRecord;
function updateSession(sessionId, onDeck, isSorted, sessionSize) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorMsg;
        // check if doc exists
        try {
            if (onDeck) {
                initRef.doc(sessionId).set({ onDeck: onDeck }, { merge: true });
                errorMsg = false;
            }
            if (isSorted !== undefined) {
                initRef.doc(sessionId).set({ isSorted: isSorted }, { merge: true });
                errorMsg = false;
            }
            if (sessionSize) {
                initRef.doc(sessionId).set({ sessionSize: sessionSize }, { merge: true });
                errorMsg = false;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                errorMsg = error.message;
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: "updatesession",
                    });
                }
            }
        }
        weapon_of_logging.info({
            message: "updateSession set",
            function: "updatesession",
        });
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
                weapon_of_logging.debug({
                    message: "snapshot.data is not undefined",
                    function: "getSession",
                });
            }
            else {
                initRef
                    .doc(sessionId)
                    .set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true })
                    .then(() => {
                    weapon_of_logging.info({
                        message: "setting session data success",
                        function: "getSession",
                    });
                })
                    .catch((error) => {
                    if (error instanceof Error) {
                        weapon_of_logging.alert({
                            message: error.message,
                            function: "updatesession",
                        });
                        isSorted = false;
                        onDeck = 0;
                        sessionSize = 0;
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "updatesession",
                });
            }
        }
        return Promise.resolve([isSorted, onDeck, sessionSize]);
    });
}
exports.getSession = getSession;
function deleteSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield deleteCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE);
            yield deleteCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS);
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "deleteSession",
                });
            }
        }
    });
}
exports.deleteSession = deleteSession;
function deleteCollection(sessionId, collectionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const docRef = db.collection("sessions").doc(sessionId);
        const docSnapshot = yield docRef.collection(collectionType).get();
        const batch = db.batch();
        if (collectionType === ServerCommunicationTypes_1.collectionTypes.INITIATIVE) {
            docRef
                .set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true })
                .then(() => {
                weapon_of_logging.debug({
                    message: "reset of session values successufl",
                    function: "clearsessionlist",
                });
            })
                .catch((error) => {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: "error resetting session values",
                        function: "clearsessionlist",
                    });
                }
            });
        }
        docSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        yield batch.commit();
    });
}
exports.deleteCollection = deleteCollection;

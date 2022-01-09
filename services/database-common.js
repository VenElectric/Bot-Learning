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
exports.getSession = exports.updateSession = exports.retrieveCollection = exports.updatecollectionRecord = exports.deleteSingle = exports.addSingle = void 0;
//@ts-ignore
const { db } = require("./firebase-setup");
const { v4: uuidv4 } = require("uuid");
const initRef = db.collection("sessions");
const LoggingClass_1 = require("../utilities/LoggingClass");
function addSingle(item, sessionId, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let isUploaded;
        let errorMsg;
        initRef
            .doc(sessionId)
            .collection(collection)
            .doc(item.id)
            .set(item)
            .then(() => {
            isUploaded = true;
            errorMsg = "";
            LoggingClass_1.weapon_of_logging.INFO("isUploaded", "added single upload", item, sessionId);
        })
            .catch((error) => {
            // error handling
            console.trace(error);
            if (error instanceof Error) {
                LoggingClass_1.weapon_of_logging.CRITICAL(error.name, error.message, error.stack, { item: item, collectionType: collection }, sessionId);
            }
            isUploaded = false;
            errorMsg = error;
        });
        return [isUploaded, errorMsg];
    });
}
exports.addSingle = addSingle;
function deleteSingle(itemId, sessionId, collection) {
    initRef
        .doc(sessionId)
        .collection(collection)
        .doc(itemId)
        .delete()
        .then(() => {
        LoggingClass_1.weapon_of_logging.INFO("isDeleted", "success deletion", itemId, sessionId);
    })
        .catch((error) => {
        if (error instanceof Error) {
            LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, { itemId: itemId, collectionType: collection }, sessionId);
        }
        console.log(error);
    });
}
exports.deleteSingle = deleteSingle;
function updatecollectionRecord(item, collection, docId, sessionId) {
    let isUploaded;
    let errorMsg;
    initRef
        .doc(sessionId)
        .collection(collection)
        .doc(docId)
        .set(item, { merge: true })
        .then(() => {
        LoggingClass_1.weapon_of_logging.INFO("updateCollectionRecord", `success updating collection ${collection}`, { item: item, docId: docId, collection: collection }, sessionId);
        isUploaded = true;
        errorMsg = 0;
    })
        .catch((error) => {
        if (error instanceof Error) {
            LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, { item: item, docId: docId, collectionType: collection }, sessionId);
        }
        isUploaded = false;
        errorMsg = error;
    });
    return [isUploaded, errorMsg];
}
exports.updatecollectionRecord = updatecollectionRecord;
function retrieveCollection(sessionId, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        let databaseList = [];
        let snapshot = yield initRef.doc(sessionId).collection(collection).get();
        if (snapshot.docs !== undefined) {
            snapshot.forEach((doc) => {
                databaseList.push(Object.assign({}, doc.data()));
            });
            // logging
        }
        if (snapshot.docs === undefined) {
            // logging
            databaseList.push(false);
        }
        return databaseList;
    });
}
exports.retrieveCollection = retrieveCollection;
function updateSession(sessionId, onDeck, isSorted, sessionSize) {
    return __awaiter(this, void 0, void 0, function* () {
        let isError = false;
        let errorMsg;
        try {
            initRef.doc(sessionId).set({ onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize }, { merge: true });
        }
        catch (error) {
            if (error instanceof Error) {
                isError = true;
                errorMsg = error.message;
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize }, sessionId);
                }
            }
        }
        return [isError, errorMsg];
    });
}
exports.updateSession = updateSession;
function getSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let snapshot = yield initRef.doc(sessionId).get();
        //@ts-ignore
        let isSorted;
        //@ts-ignore
        let onDeck;
        //@ts-ignore
        let sessionSize;
        console.log("in get session");
        try {
            console.log("in try catch ");
            if (snapshot.data() != undefined) {
                console.log(snapshot.data(), "not undefined");
                isSorted = snapshot.data().isSorted;
                onDeck = snapshot.data().onDeck;
                sessionSize = snapshot.data().sessionSize;
                LoggingClass_1.weapon_of_logging.INFO("getSession", "grabbingSessionData", { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize }, sessionId);
            }
            else {
                console.log("initref set");
                initRef.doc(sessionId).set({ isSorted: false, onDeck: 0, sessionSize: 0 }, { merge: true }).then(() => { console.log("sucess"); }).catch((error) => {
                    if (error instanceof Error) {
                        LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, 
                        //@ts-ignore
                        { onDeck: onDeck, isSorted: isSorted, sessionSize: sessionSize }, sessionId);
                    }
                });
                console.log(sessionId);
            }
        }
        catch (error) {
            console.log(error);
            console.log("in error");
            console.log(typeof (snapshot.data()));
            console.log(snapshot.data());
            if (error instanceof Error) {
                LoggingClass_1.weapon_of_logging.ERROR(error.name, error.message, error.stack, sessionId, sessionId);
            }
            // better logging and error handling
        }
        return [isSorted, onDeck, sessionSize];
    });
}
exports.getSession = getSession;

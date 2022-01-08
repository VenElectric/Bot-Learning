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
const constants_1 = require("./constants");
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
        })
            .catch((error) => {
            // error handling
            console.log(error);
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
        // insert logging here
        console.log("Success?");
    })
        .catch((error) => {
        // error handling
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
        console.log("success");
        isUploaded = true;
        errorMsg = 0;
    })
        .catch((error) => {
        console.log(error);
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
            }
        }
        return [isError, errorMsg];
    });
}
exports.updateSession = updateSession;
function getSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let snapshot = yield initRef.doc(sessionId).get();
        let isSorted;
        let onDeck;
        let sessionSize;
        try {
            if (snapshot.data().isSorted != undefined) {
                isSorted = snapshot.data().isSorted;
            }
            if (snapshot.data().isSorted == undefined) {
                initRef.doc(sessionId).set({ isSorted: false }, { merge: true });
                isSorted = false;
            }
            if (snapshot.data().onDeck != undefined) {
                onDeck = snapshot.data().onDeck;
            }
            if (snapshot.data().onDeck == undefined) {
                initRef.doc(sessionId).set({ onDeck: 0 }, { merge: true });
                onDeck = 0;
            }
            if (snapshot.data().sessionSize != undefined) {
                sessionSize = snapshot.data().sessionSize;
            }
            if (snapshot.data().sessionSize == undefined) {
                let session = yield retrieveCollection(sessionId, constants_1.initiativeCollection);
                sessionSize = !session[0] ? session.length : 0;
                initRef.doc(sessionId).set({ sessionSize: sessionSize }, { merge: true });
            }
        }
        catch (error) {
            console.log(error);
            // better logging and error handling
        }
        console.log(onDeck);
        return [isSorted, onDeck, sessionSize];
    });
}
exports.getSession = getSession;

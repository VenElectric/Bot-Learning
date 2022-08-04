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
const LoggingTypes_1 = require("../../Interfaces/LoggingTypes");
const BaseClass_1 = __importDefault(require("../../utilities/BaseClass"));
const { db } = require("../../services/firebase-setup");
class SessionBase extends BaseClass_1.default {
    constructor(sonic) {
        super(sonic);
        this.db = db;
        this.topLevel = undefined;
        this.secondLevel = undefined;
    }
    checkCollectionAssignment() {
        if (this.topLevel == undefined || this.secondLevel == undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    constructCollectionRef(topID) {
        if (this.checkCollectionAssignment())
            throw new Error("Top Level or Second Level Assignments Undefined  for SessionBase");
        return this.db
            .collection(this.topLevel)
            .doc(topID)
            .collection(this.secondLevel);
    }
    constructDocRef(topID, secondLevelID) {
        if (this.checkCollectionAssignment())
            throw new Error("Top Level or Second Level Assignments Undefined for SessionBase");
        return this.db
            .collection(this.topLevel)
            .doc(topID)
            .collection(this.secondLevel)
            .doc(secondLevelID);
    }
    addDoc(item, topLevelID) {
        return __awaiter(this, arguments, void 0, function* () {
            const dbRef = this.constructDocRef(topLevelID, item.id);
            try {
                dbRef.set(item);
                this.log(`added item to collection ${this.secondLevel}`, this.info, this.addDoc.name, ...arguments);
            }
            catch (error) {
                this.onError(error, this.addDoc.name, ...arguments);
            }
        });
    }
    deleteDoc(docId, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dbRef = this.constructDocRef(sessionId, docId);
                dbRef.delete();
                this.log(`deleting one item from ${this.secondLevel}`, LoggingTypes_1.LoggingTypes.info, this.deleteDoc.name, ...arguments);
            }
            catch (error) {
                this.onError(error, this.deleteDoc.name, ...arguments);
            }
        });
    }
    updateDocItem(value, docId, sessionId, valueName) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dbRef = this.constructDocRef(sessionId, docId);
                dbRef.set({ [valueName]: value }, { merge: true });
                this.log(`successfully updated ${valueName} in ${this.secondLevel}`, LoggingTypes_1.LoggingTypes.info, this.updateDocItem.name, ...arguments);
            }
            catch (error) {
                this.onError(error, this.updateDocItem.name, ...arguments);
            }
        });
    }
    updateCollection(sessionId, payload) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dbRef = this.constructCollectionRef(sessionId);
                const batch = this.db.batch();
                for (const record of payload) {
                    const recordRef = dbRef.doc(record.id);
                    batch.set(recordRef, record);
                }
                yield batch.commit();
                this.log(`documents successfully updated`, LoggingTypes_1.LoggingTypes.info, this.updateCollection.name, ...arguments);
            }
            catch (error) {
                this.onError(error, this.updateCollection.name, ...arguments);
            }
        });
    }
    updateCollectionDoc(payload, docId, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dbRef = this.constructDocRef(sessionId, docId);
                dbRef.set(payload, { merge: true });
                this.log(`updating document`, LoggingTypes_1.LoggingTypes.info, this.updateCollectionDoc.name, ...arguments);
            }
            catch (error) {
                this.onError(error, this.updateCollectionDoc.name, ...arguments);
            }
        });
    }
    retrieveCollection(sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            let databaseList = [];
            try {
                const dbRef = this.constructCollectionRef(sessionId);
                const snapshot = yield dbRef.get();
                snapshot.forEach((doc) => {
                    databaseList.push(Object.assign({}, doc.data()));
                });
                this.log(`retrieved ${this.secondLevel}`, LoggingTypes_1.LoggingTypes.info, this.retrieveCollection.name, ...arguments);
                return databaseList;
            }
            catch (error) {
                this.onError(error, this.retrieveCollection.name, ...arguments);
                return [];
            }
        });
    }
    retrieveDoc(docId, sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dbRef = this.constructDocRef(sessionId, docId);
                const snapshot = yield dbRef.get();
                this.log(`retrieved doc from ${this.secondLevel}`, LoggingTypes_1.LoggingTypes.info, this.retrieveDoc.name, ...arguments);
                return Object.assign({}, snapshot.data());
            }
            catch (error) {
                this.onError(error, this.updateCollectionDoc.name, ...arguments);
                return {};
            }
        });
    }
    updateSessionValues(sessionId, next, previous, isSorted, sessionSize) {
        try {
            const dbRef = this.db.collection(this.topLevel).doc(sessionId);
            if (next !== undefined) {
                dbRef.set({ onDeck: next }, { merge: true });
            }
            if (previous !== undefined) {
                dbRef.set({ previous: previous }, { merge: true });
            }
            if (isSorted !== undefined) {
                dbRef.set({ isSorted: isSorted }, { merge: true });
            }
            if (sessionSize) {
                dbRef.set({ sessionSize: sessionSize }, { merge: true });
            }
            this.log("updated session values", LoggingTypes_1.LoggingTypes.info, this.updateSessionValues.name, ...arguments);
        }
        catch (error) {
            this.onError(error, this.updateSessionValues.name, ...arguments);
        }
    }
    getSession(sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dbRef = this.db.collection(this.topLevel).doc(sessionId);
                const snapshot = yield dbRef.get();
                return {
                    isSorted: snapshot.data().isSorted,
                    previous: snapshot.data().previous,
                    next: snapshot.data().next,
                    sessionSize: snapshot.data().sessionSize,
                };
            }
            catch (error) {
                this.onError(error, this.updateCollectionDoc.name, ...arguments);
                return { isSorted: false, next: "", previous: "", sessionSize: 0 };
            }
        });
    }
    deleteCollection(sessionId) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const dbRef = this.constructCollectionRef(sessionId);
                const snapshot = yield dbRef.get();
                const batch = this.db.batch();
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                yield batch.commit();
                this.log(`deleted ${this.secondLevel}`, LoggingTypes_1.LoggingTypes.info, this.deleteCollection.name, ...arguments);
            }
            catch (error) {
                this.onError(error, this.deleteCollection.name, ...arguments);
            }
            // call update session after deletion.
        });
    }
}
exports.default = SessionBase;

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
exports.weapon_of_logging = void 0;
const { LEVEL } = require("triple-beam");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { firestore } = require("firebase-admin");
const { db } = require("../services/firebase-setup");
const initRef = db.collection("sessions");
const index_1 = require("../index");
const ENUMS_1 = require("../Interfaces/ENUMS");
require("dotenv").config();
var LoggingTypes;
(function (LoggingTypes) {
    LoggingTypes["EMERGENCY"] = "EMERGENCY";
    LoggingTypes["ALERT"] = "ALERT";
    LoggingTypes["CRITICAL"] = "CRITICAL";
    LoggingTypes["ERROR"] = "ERROR";
    LoggingTypes["WARN"] = "WARN";
    LoggingTypes["NOTICE"] = "NOTICE";
    LoggingTypes["INFO"] = "INFO";
    LoggingTypes["DEBUG"] = "DEBUG";
})(LoggingTypes || (LoggingTypes = {}));
function addLog(item, sessionId) {
    let isUploaded;
    let errorMsg;
    initRef
        .doc(sessionId)
        .collection(ENUMS_1.collectionTypes.LOGGING)
        .doc(item.id)
        .set(item)
        .then(() => {
        isUploaded = true;
        errorMsg = "";
    })
        .catch((error) => {
        // error handling
        console.log("ERRRASDF;LKJASD;FLKJAS;LDKJAS;LDFJAS;LKD");
        if (errorMsg instanceof Error) {
            console.log(error);
            console.trace(error.name);
            console.trace(error.msg);
        }
        isUploaded = false;
        errorMsg = error;
    });
    return [isUploaded, errorMsg];
}
exports.weapon_of_logging = {
    [LoggingTypes.EMERGENCY](errorName, errorMessage, stackTrace, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.EMERGENCY,
                [LEVEL]: LoggingTypes.EMERGENCY,
                errorName: errorName,
                errorMessage: errorMessage,
                data: data,
                stackTrace: stackTrace,
                date: firestore.Timestamp.now(),
            };
            try {
                index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                    channel.send(`Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data}`);
                });
                let [isUploaded, errorMsg] = addLog(options, sessionId);
                if (errorMsg instanceof Error) {
                    console.trace(isUploaded);
                    console.trace(errorMsg);
                }
            }
            catch (error) {
                console.error(options);
                console.error(error);
                return;
            }
        });
    },
    [LoggingTypes.ALERT](errorName, errorMessage, stackTrace, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.ALERT,
                [LEVEL]: LoggingTypes.ALERT,
                errorName: errorName,
                errorMessage: errorMessage,
                data: data,
                stackTrace: stackTrace,
                date: firestore.Timestamp.now(),
            };
            try {
                index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                    channel.send(`Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data}`);
                });
                let [isUploaded, errorMsg] = addLog(options, sessionId);
                if (errorMsg instanceof Error) {
                    console.trace(isUploaded);
                    console.trace(errorMsg);
                }
            }
            catch (error) {
                console.error(options);
                console.error(error);
            }
        });
    },
    [LoggingTypes.CRITICAL](errorName, errorMessage, stackTrace, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.CRITICAL,
                [LEVEL]: LoggingTypes.CRITICAL,
                errorName: errorName,
                errorMessage: errorMessage,
                stackTrace: stackTrace,
                data: data,
                date: firestore.Timestamp.now(),
            };
            try {
                index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                    channel.send(`Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data}`);
                });
                let [isUploaded, errorMsg] = addLog(options, sessionId);
                if (errorMsg instanceof Error) {
                    console.trace(isUploaded);
                    console.trace(errorMsg);
                }
            }
            catch (error) {
                console.error(options);
                console.error(error);
            }
        });
    },
    [LoggingTypes.ERROR](errorName, errorMessage, stackTrace, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.ERROR,
                [LEVEL]: LoggingTypes.ERROR,
                errorName: errorName,
                errorMessage: errorMessage,
                stackTrace: stackTrace,
                data: data,
                date: firestore.Timestamp.now(),
            };
            try {
                let [isUploaded, errorMsg] = addLog(options, sessionId);
                if (errorMsg instanceof Error) {
                    console.trace(isUploaded);
                    console.trace(errorMsg);
                }
            }
            catch (error) {
                console.error(options);
                console.error(error);
            }
        });
    },
    [LoggingTypes.WARN](errorName, errorMessage, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.WARN,
                [LEVEL]: LoggingTypes.WARN,
                errorName: errorName,
                errorMessage: errorMessage,
                data: data,
                date: firestore.Timestamp.now(),
            };
            try {
                let [isUploaded, errorMsg] = addLog(options, sessionId);
                if (errorMsg instanceof Error) {
                    console.trace(isUploaded);
                    console.trace(errorMsg);
                }
            }
            catch (error) {
                console.error(options);
                console.error(error);
            }
        });
    },
    [LoggingTypes.NOTICE](noticeName, noticeMessage, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.NOTICE,
                [LEVEL]: LoggingTypes.NOTICE,
                errorName: noticeName,
                errorMessage: noticeMessage,
                data: data,
                date: firestore.Timestamp.now(),
            };
            try {
                let [isUploaded, errorMsg] = addLog(options, sessionId);
                if (errorMsg instanceof Error) {
                    console.trace(isUploaded);
                    console.trace(errorMsg);
                }
            }
            catch (error) {
                console.error(options);
                console.error(error);
            }
        });
    },
    [LoggingTypes.INFO](infoName, infoMessage, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.INFO,
                [LEVEL]: LoggingTypes.INFO,
                infoName: infoName,
                infoMessage: infoMessage,
                data: data,
                date: firestore.Timestamp.now(),
            };
            try {
                let [isUploaded, errorMsg] = addLog(options, sessionId);
                if (errorMsg instanceof Error) {
                    console.trace(isUploaded);
                    console.trace(errorMsg);
                }
            }
            catch (error) {
                console.error(options);
                console.error(error);
            }
        });
    },
    [LoggingTypes.DEBUG](debugName, debugMessage, data, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes.INFO,
                [LEVEL]: LoggingTypes.INFO,
                debugName: debugName,
                debugMessage: debugMessage,
                data: data,
                date: firestore.Timestamp.now(),
                sessionId: sessionId,
            };
            try {
                console.log(options);
                fs.appendFile("logs.txt", JSON.stringify(options) + "\n", function (error) {
                    if (error) {
                        return console.error(options, error);
                    }
                    console.log("Data written successfully!");
                    // Read the newly written file and print all of its content on the console
                });
            }
            catch (error) {
                console.error(options);
                console.error(error);
                return;
            }
        });
    },
};

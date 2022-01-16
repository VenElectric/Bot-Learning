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
exports.weapon_of_logging = void 0;
const { LEVEL } = require("triple-beam");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const LoggingTypes_1 = require("../Interfaces/LoggingTypes");
const dayjs_1 = __importDefault(require("dayjs"));
const { firestore } = require("firebase-admin");
const { db } = require("../services/firebase-setup");
const logRef = db.collection("logging");
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../index");
require("dotenv").config();
function addLog(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let errorMsg;
        console.log(chalk_1.default.greenBright(item.id));
        logRef
            .doc(item.id)
            .set(item)
            .then(() => {
            errorMsg = false;
        })
            .catch((error) => {
            // error handling
            errorMsg = error;
        });
        return Promise.resolve(errorMsg);
    });
}
exports.weapon_of_logging = {
    [LoggingTypes_1.LoggingTypes.EMERGENCY](errorName, errorMessage, stackTrace, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.EMERGENCY,
                [LEVEL]: LoggingTypes_1.LoggingTypes.EMERGENCY,
                errorName: errorName,
                errorMessage: errorMessage,
                data: JSON.stringify(data),
                stackTrace: stackTrace,
                date: firestore.Timestamp.now(),
            };
            try {
                index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                    channel.send(`Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data} \n Stack Trace: ${stackTrace}`);
                }).catch((error) => {
                    console.error(chalk_1.default.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
                });
                let errorMsg = yield addLog(options);
                if (errorMsg instanceof Error) {
                    console.log(chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                    console.log(chalk_1.default.bgRedBright(errorMsg.message));
                    exports.weapon_of_logging.DEBUG(errorMsg.name, errorMsg.message, chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                }
            }
        });
    },
    [LoggingTypes_1.LoggingTypes.ALERT](errorName, errorMessage, stackTrace, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.ALERT,
                [LEVEL]: LoggingTypes_1.LoggingTypes.ALERT,
                errorName: errorName,
                errorMessage: errorMessage,
                data: JSON.stringify(data),
                stackTrace: stackTrace,
                date: firestore.Timestamp.now(),
            };
            try {
                index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                    channel.send(`Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data} \n Stack Trace: ${stackTrace}`);
                }).catch((error) => {
                    console.error(chalk_1.default.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
                });
                let errorMsg = yield addLog(options);
                if (errorMsg instanceof Error) {
                    console.log(chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                    console.log(chalk_1.default.bgRedBright(errorMsg.message));
                    exports.weapon_of_logging.DEBUG(errorMsg.name, errorMsg.message, chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                }
            }
        });
    },
    [LoggingTypes_1.LoggingTypes.CRITICAL](errorName, errorMessage, stackTrace, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.CRITICAL,
                [LEVEL]: LoggingTypes_1.LoggingTypes.CRITICAL,
                errorName: errorName,
                errorMessage: errorMessage,
                stackTrace: stackTrace,
                data: JSON.stringify(data),
                date: firestore.Timestamp.now(),
            };
            try {
                index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                    channel.send(`Error: ${errorName} \n Message: ${errorMessage} \n Data: ${data} \n Stack Trace: ${stackTrace}`);
                }).catch((error) => {
                    console.error(chalk_1.default.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an error sending to the channel ${options[LEVEL]}`));
                });
                let errorMsg = yield addLog(options);
                if (errorMsg instanceof Error) {
                    console.log(chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                    console.log(chalk_1.default.bgRedBright(errorMsg.message));
                    exports.weapon_of_logging.DEBUG(errorMsg.name, errorMsg.message, chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                }
            }
        });
    },
    [LoggingTypes_1.LoggingTypes.ERROR](errorName, errorMessage, stackTrace, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.ERROR,
                [LEVEL]: LoggingTypes_1.LoggingTypes.ERROR,
                errorName: errorName,
                errorMessage: errorMessage,
                stackTrace: stackTrace,
                data: JSON.stringify(data),
                date: firestore.Timestamp.now(),
            };
            try {
                let errorMsg = yield addLog(options);
                if (errorMsg instanceof Error) {
                    console.log(chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                    console.log(chalk_1.default.bgRedBright(errorMsg.message));
                    exports.weapon_of_logging.DEBUG(errorMsg.name, errorMsg.message, chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                }
            }
        });
    },
    [LoggingTypes_1.LoggingTypes.WARN](errorName, errorMessage, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.WARN,
                [LEVEL]: LoggingTypes_1.LoggingTypes.WARN,
                errorName: errorName,
                errorMessage: errorMessage,
                data: JSON.stringify(data),
                date: firestore.Timestamp.now(),
            };
            try {
                let errorMsg = yield addLog(options);
                if (errorMsg instanceof Error) {
                    console.log(chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                    console.log(chalk_1.default.bgRedBright(errorMsg.message));
                    exports.weapon_of_logging.DEBUG(errorMsg.name, errorMsg.message, chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                }
            }
        });
    },
    [LoggingTypes_1.LoggingTypes.NOTICE](noticeName, noticeMessage, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.NOTICE,
                [LEVEL]: LoggingTypes_1.LoggingTypes.NOTICE,
                errorName: noticeName,
                errorMessage: noticeMessage,
                data: JSON.stringify(data),
                date: firestore.Timestamp.now(),
            };
            try {
                let errorMsg = yield addLog(options);
                if (errorMsg instanceof Error) {
                    console.log(chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                    console.log(chalk_1.default.bgRedBright(errorMsg.message));
                    exports.weapon_of_logging.DEBUG(errorMsg.name, errorMsg.message, chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                }
            }
        });
    },
    [LoggingTypes_1.LoggingTypes.INFO](infoName, infoMessage, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.INFO,
                [LEVEL]: LoggingTypes_1.LoggingTypes.INFO,
                infoName: infoName,
                infoMessage: infoMessage,
                data: JSON.stringify(data),
                date: firestore.Timestamp.now(),
            };
            try {
                let errorMsg = yield addLog(options);
                if (errorMsg instanceof Error) {
                    console.log(chalk_1.default.bgRedBright(`There was an error logging to the database ${options[LEVEL]}`));
                    console.log(chalk_1.default.bgRedBright(errorMsg.message));
                    exports.weapon_of_logging.DEBUG(errorMsg.name, errorMsg.message, chalk_1.default.bgRedBright("There was an error logging to the database"));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                    console.error(error);
                    exports.weapon_of_logging.DEBUG(error.name, error.message, chalk_1.default.bgRedBright(`There was an uncaught error. ${options[LEVEL]}`));
                }
            }
        });
    },
    [LoggingTypes_1.LoggingTypes.DEBUG](debugName, debugMessage, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                id: uuidv4(),
                level: LoggingTypes_1.LoggingTypes.DEBUG,
                [LEVEL]: LoggingTypes_1.LoggingTypes.DEBUG,
                debugName: debugName,
                debugMessage: debugMessage,
                adata: JSON.stringify(data),
                date: (0, dayjs_1.default)()
            };
            try {
                fs.appendFile("logs.txt", JSON.stringify(options) + "\n", function (error) {
                    if (error) {
                        console.error(options, error);
                        return error;
                    }
                    // Read the newly written file and print all of its content on the console
                });
            }
            catch (error) {
                console.error(chalk_1.default.bgRedBright(`There was an error writing to the file. Level ${options[LEVEL]}`));
                console.error(error);
            }
        });
    },
};

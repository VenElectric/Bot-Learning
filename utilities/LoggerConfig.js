"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transport = require("winston-transport");
const util = require("util");
const winston = require("winston");
const { db } = require("../services/firebase-setup");
const { firestore } = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const Logger = require('le_node');
const index_1 = require("../index");
require("dotenv").config();
const logger = new Logger({
    token: process.env.LOG_ENTRIES
});
class LogEntriesTransport extends Transport {
    constructor(options) {
        super(options);
        this.params = options.params || ['level', 'message'];
    }
    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });
        let result = Object.values(info).some((item) => item == null);
        if (result) {
            throw new Error(`Parameters in a log can not be null.`);
        }
        if (info.level === "error") {
            index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                channel.send(`Critical Error Occurred. Please check logs`);
            }).catch((error) => {
                logger.info(error.message);
            });
        }
        logger.log(info.level, { message: info.message, function: info.function });
        callback();
    }
}
class FirestoreTransport extends Transport {
    constructor(options) {
        super(options);
        if (!options.hasOwnProperty("collection")) {
            throw new Error(`A collection is required`);
        }
        else {
            this.collectionRef = db.collection(options.collection);
        }
        this.params = options.params || ['level', 'message'];
    }
    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        let result = Object.values(info).some((item) => item == null);
        if (result) {
            throw new Error(`Parameters in a log can not be null.`);
        }
        let docId = uuidv4();
        if (info.level === "error") {
            index_1.client.channels.fetch(process.env.MY_DISCORD).then((channel) => {
                channel.send(`Critical Error Occurred. Please check logs`);
            });
        }
        this.collectionRef.doc(docId).set(Object.assign(Object.assign({}, info), { timestamp: firestore.Timestamp.now() }));
        callback();
    }
}
// const customLevels = {
//   levels :{
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     debug: 5,
//   },
//   colors :{
//     info: 'cyan',
//     debug: 'blue',
//     http: 'cyan',
//     warn: 'yellow',
//     error: 'red'
//   }
// }
const weapon_of_logging = winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 5,
    },
    format: winston.format.json(),
    defaultMeta: { service: 'dungeon-bot' },
    transports: [
        new LogEntriesTransport({
            params: ["level", "message", "function"],
            level: "debug"
        }),
    ],
});
// const weapon_of_logging = winston.createLogger({
//   levels :{
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     debug: 5,
//   },
//   format: winston.format.json(),
//   defaultMeta: { service: 'dungeon-bot' },
//   transports: [
//     new FirestoreTransport({
//       collection: "logging",
//       params: ["level", "message","function"],
//       level: "debug"
//     }),
//   ],
// });
exports.logger = weapon_of_logging;

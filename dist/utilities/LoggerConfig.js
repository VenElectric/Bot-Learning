"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transport = require("winston-transport");
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
const node_1 = require("@logtail/node");
require("dotenv").config();
const logKey = process.env.LOG_TAIL;
const logger = new node_1.Logtail(logKey);
class LogTailTransport extends Transport {
    constructor(options) {
        super(options);
        this.params = options.params || ["level", "message", "function"];
    }
    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        let result = Object.values(info).some((item) => item == null);
        if (result) {
            throw new Error(`Parameters in a log can not be null.`);
        }
        if (info.level) {
            String(info.level);
            logger.log(info.message, info.level, Object.assign({ function: info.function }, info));
        }
        else {
            logger.log(info);
        }
        callback();
    }
}
const weapon_of_logging = winston.createLogger({
    levels: {
        alert: 0,
        warning: 1,
        info: 2,
        debug: 3,
    },
    format: winston.format.json(),
    defaultMeta: { service: "dungeon-bot" },
    transports: [
        new LogTailTransport({
            params: ["level", "message", "function"],
            level: "debug",
        }),
    ],
});
exports.logger = weapon_of_logging;

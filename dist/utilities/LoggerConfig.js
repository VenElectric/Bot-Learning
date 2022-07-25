"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transport = require("winston-transport");
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
const Logger = require("le_node");
const index_1 = require("../index");
require("dotenv").config();
const logger = new Logger({
    token: process.env.LOG_ENTRIES,
});
class LogEntriesTransport extends Transport {
    constructor(options) {
        super(options);
        this.params = options.params || ["level", "message", "function", "itemId"];
    }
    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        let result = Object.values(info).some((item) => item == null);
        if (result) {
            throw new Error(`Parameters in a log can not be null.`);
        }
        if (info.level === "alert") {
            index_1.client.channels
                .fetch(process.env.MY_DISCORD)
                .then((channel) => {
                channel.send(`${info.function}: ${info.message}`);
            })
                .catch((error) => {
                logger.info(error.message);
            });
        }
        if (info.level) {
            logger.log(String(info.level), Object.assign({ message: info.message, function: info.function, itemId: info.itemId }, info));
        }
        else {
            console.log(info);
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
        new LogEntriesTransport({
            params: ["level", "message", "function", "itemId"],
            level: "debug",
        }),
    ],
});
exports.logger = weapon_of_logging;

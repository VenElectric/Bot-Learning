"use strict";
const Transport = require("winston-transport");
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
const { Logtail } = require("@logtail/node");
require("dotenv").config();
const logger = new Logtail(process.env.LOG_TAIL);
class LogTailTransport extends Transport {
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
        if (info.level) {
            String(info.level);
            logger.log(info.message, info.level, {
                function: info.function,
                itemId: info.itemId,
                meta: info.meta,
                ...info
            });
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
        new LogTailTransport({
            params: ["level", "message", "function", "itemId"],
            level: "debug",
        }),
    ],
});
exports.logger = weapon_of_logging;

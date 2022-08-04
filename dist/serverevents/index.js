"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base = exports.SonicEmitter = exports.utilityMixin = void 0;
const discord_js_1 = require("discord.js");
const node_events_1 = require("node:events");
const LoggingTypes_1 = require("../Interfaces/LoggingTypes");
const mathjs_1 = require("mathjs");
const path = require("node:path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
function utilityMixin(Base) {
    return class UtilityMixin extends Base {
        constructor(...args) {
            super();
            this.info = LoggingTypes_1.LoggingTypes.info;
            this.alert = LoggingTypes_1.LoggingTypes.alert;
            this.warning = LoggingTypes_1.LoggingTypes.warning;
            this.debug = LoggingTypes_1.LoggingTypes.debug;
        }
        uuid() {
            return uuidv4();
        }
        log(message, level, called, ...args) {
            weapon_of_logging.log(Object.assign({ message: message, level: level, function: called }, args));
        }
        onError(error, called, ...args) {
            if (error instanceof Error) {
                weapon_of_logging.alert(Object.assign({ message: error.message, function: called, name: error.name }, args));
            }
        }
        eval(evalStr) {
            return (0, mathjs_1.evaluate)(evalStr);
        }
        findIndexById(dataArray, id) {
            return dataArray.map((dataObject) => dataObject.id).indexOf(id);
        }
    };
}
exports.utilityMixin = utilityMixin;
class SonicEmitter extends node_events_1.EventEmitter {
    constructor() {
        super();
        this.events = new discord_js_1.Collection();
    }
    init() {
        this.on("error", (error) => {
            this.onError(error, "on");
            console.log(error);
        });
        const eventsPath = path.join(__dirname, "events");
        const eventFiles = fs
            .readdirSync(eventsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            }
            else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}
exports.SonicEmitter = SonicEmitter;
exports.base = utilityMixin(SonicEmitter);

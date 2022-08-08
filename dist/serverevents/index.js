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
            this.parseRegex = new RegExp(/([\d]*|[d|D]*)(\s?)([a-z]|[\d]+)/);
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
        addBash(item, color) {
            let final = "";
            switch (color.toLowerCase()) {
                case "green":
                    final = '```bash\n' + '"' + item + '"' + '```';
                    break;
                case "blue":
                    final = '```ini\n' + '[' + item + ']' + '```';
                    break;
            }
            return final;
        }
        parseRoll(msg) {
            let comment = "";
            let rollex = "";
            let length = msg.length;
            let prevtype = false;
            this.log("entering parse roll", this.debug, this.parseRoll.name);
            for (let i = 0; i < length; i++) {
                // trying to match the d20 roll
                if (msg[i].match(/^\d*([d|D])([0-9])+/) && !prevtype) {
                    this.log("match for ^\\d*([d|D])([0-9])+ regex", this.debug, this.parseRoll.name);
                    rollex += msg[i];
                    continue;
                }
                // trying to match the d20 roll addition or subtraction
                if (msg[i].match(/[(]|[)]|[+|/|*|-]/) && !prevtype) {
                    this.log("match for [(]|[)]|[+|/|*|-] regex", this.debug, this.parseRoll.name);
                    rollex += msg[i];
                    continue;
                }
                // trying to match the d20 roll numbers
                if (msg[i].match(/[1-9]+/) && !prevtype) {
                    this.log("match for number and not prevtype", this.debug, this.parseRoll.name);
                    rollex += msg[i];
                    continue;
                }
                // matching the comments to parse into a new variable
                // Once we hit the comments, prevtype is true because we know there will be no more math or rolls afterwards.
                // not matching symbols because it's hitting the upper if statements first. Need a way to tell the function to stop after the d20 roll....
                if (typeof (msg[i]) == 'string' || prevtype) {
                    this.log("match for string and prevtype", this.debug, this.parseRoll.name);
                    prevtype = true;
                    comment += msg[i] + ' ';
                }
            }
            return { comment: comment, roll: rollex };
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

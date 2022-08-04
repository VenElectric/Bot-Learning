"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Collection } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
class Congregate {
    constructor() {
        this.processes = new Collection();
    }
    addProcesses(name, process) {
        this.processes.set(name, process);
    }
    retrieveProcess(name) {
        return this.processes.get(name);
    }
    logger(wrapped) {
        console.log(wrapped);
        weapon_of_logging.info({ message: "logging process call", function: "testing function" });
        return (...args) => {
            // nothing happens in here except the function
            wrapped(args);
        };
    }
}
let congregation = new Congregate();
module.exports = congregation;

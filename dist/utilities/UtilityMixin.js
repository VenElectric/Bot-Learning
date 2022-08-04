"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingTypes_1 = require("../Interfaces/LoggingTypes");
const { v4: uuidv4 } = require("uuid");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
let UtilityMixin = {
    info: LoggingTypes_1.LoggingTypes.info,
    alert: LoggingTypes_1.LoggingTypes.alert,
    warning: LoggingTypes_1.LoggingTypes.warning,
    debug: LoggingTypes_1.LoggingTypes.debug,
    uuid() {
        return uuidv4();
    },
    log(message, level, called, ...args) {
        weapon_of_logging.log(Object.assign({ message: message, level: level, function: called }, args));
    },
    onError(error, called, ...args) {
        if (error instanceof Error) {
            weapon_of_logging.alert(Object.assign({ message: error.message, function: called, name: error.name }, args));
        }
    },
};
exports.default = UtilityMixin;

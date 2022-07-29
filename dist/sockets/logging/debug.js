"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingTypes_1 = require("../../Interfaces/LoggingTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: LoggingTypes_1.LoggingTypes.debug,
    async execute(io, socket, client, data) {
        weapon_of_logging.debug({ message: data.message, function: data.function, meta: { service: "dungeon-bot-web" } });
    },
};

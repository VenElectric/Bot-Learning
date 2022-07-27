"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingTypes_1 = require("../../Interfaces/LoggingTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
function loggingSocket(socket) {
    socket.on(LoggingTypes_1.LoggingTypes.debug, async function (data) {
        weapon_of_logging.debug({ message: data.message, function: data.function });
    });
    // LOGGING SOCKETS
    socket.on(LoggingTypes_1.LoggingTypes.info, async function (data) {
        weapon_of_logging.info({ message: data.message, function: data.function });
    });
    socket.on(LoggingTypes_1.LoggingTypes.alert, async function (data) {
        weapon_of_logging.alert({ message: data.message, function: data.function });
    });
    socket.on(LoggingTypes_1.LoggingTypes.warning, async function (data) {
        weapon_of_logging.warning({
            message: data.message,
            function: data.function,
        });
    });
}
exports.default = loggingSocket;

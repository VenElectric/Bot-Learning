"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingTypes_1 = require("../../Interfaces/LoggingTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
function loggingSocket(socket) {
    socket.on(LoggingTypes_1.LoggingTypes.debug, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.debug({ message: data.message, function: data.function });
        });
    });
    // LOGGING SOCKETS
    socket.on(LoggingTypes_1.LoggingTypes.info, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.info({ message: data.message, function: data.function });
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.alert, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.alert({ message: data.message, function: data.function });
        });
    });
    socket.on(LoggingTypes_1.LoggingTypes.warning, function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.warning({
                message: data.message,
                function: data.function,
            });
        });
    });
}
exports.default = loggingSocket;
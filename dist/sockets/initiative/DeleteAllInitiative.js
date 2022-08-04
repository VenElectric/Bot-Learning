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
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const database_common_1 = require("../../services/database-common");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE,
    execute(io, socket, client) {
        return __awaiter(this, void 0, void 0, function* () {
            socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE, function (sessionId) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield (0, database_common_1.deleteCollection)(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
                    }
                    catch (error) {
                        if (error instanceof Error) {
                            weapon_of_logging.alert({
                                message: error.message,
                                function: ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE,
                            });
                        }
                    }
                    socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_SESSION, false);
                    socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE);
                });
            });
        });
    }
};

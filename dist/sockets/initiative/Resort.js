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
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.RESORT,
    execute(io, socket, client, sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { retrieveCollection } = require("../../services/database-common");
            const { resortInitiative } = require("../../services/initiative");
            let initiativeList = (yield retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
            try {
                initiativeList = resortInitiative(initiativeList);
                weapon_of_logging.info({
                    message: "Resort Complete",
                    function: ServerCommunicationTypes_1.EmitTypes.RESORT,
                });
                socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                    payload: initiativeList,
                    isSorted: true,
                });
                respond(initiativeList);
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.RESORT,
                    });
                }
            }
        });
    }
};

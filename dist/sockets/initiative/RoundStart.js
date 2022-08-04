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
const util_1 = require("../util");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.ROUND_START,
    execute(io, socket, client, sessionId, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const { retrieveCollection } = require("../../services/database-common");
            const { finalizeInitiative } = require("../../services/initiative");
            const { initiativeEmbed } = require("../../services/create-embed");
            try {
                let initiativeList = (yield retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
                weapon_of_logging.debug({
                    message: "starting round start, initiative retrieved",
                    function: "ROUND_START SOCKET_RECEIVER",
                });
                initiativeList = yield finalizeInitiative(initiativeList, true, sessionId);
                const startEmbed = initiativeEmbed(initiativeList);
                (0, util_1.channelSend)(client, { embeds: [startEmbed], content: "Rounds have started" }, sessionId);
                weapon_of_logging.info({
                    message: "initiative sorted and being emitted",
                    function: "ROUND_START SOCKET_RECEIVER",
                });
                io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.ROUND_START);
                socket.broadcast.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_ALL_INITIATIVE, {
                    payload: initiativeList,
                    collectionType: ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE,
                    isSorted: true,
                });
                respond(initiativeList);
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    weapon_of_logging.warning({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.ROUND_START,
                    });
                    respond("No initiative to sort. Please add in initiative");
                }
                else if (error instanceof Error && !(error instanceof ReferenceError)) {
                    weapon_of_logging.alert({
                        message: error.message,
                        function: ServerCommunicationTypes_1.EmitTypes.ROUND_START,
                    });
                }
            }
        });
    },
};

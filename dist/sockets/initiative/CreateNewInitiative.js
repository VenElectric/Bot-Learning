"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE,
    async execute(io, socket, client, data) {
        const { addSingle, updateSession, } = require("../../services/database-common");
        let finalMessage;
        weapon_of_logging.debug({
            message: data.payload,
            function: "Create new socket receiver",
        });
        finalMessage = await addSingle(data.payload, data.sessionId, ServerCommunicationTypes_1.topLevelCollections.SESSIONS, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
        updateSession(data.sessionId, undefined, false);
        socket.broadcast
            .to(data.sessionId)
            .emit(ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE, data.payload);
        if (finalMessage instanceof Error) {
            weapon_of_logging.alert({
                message: finalMessage.message,
                function: ServerCommunicationTypes_1.EmitTypes.CREATE_NEW_INITIATIVE,
                docId: data.payload.id,
            });
        }
    },
};

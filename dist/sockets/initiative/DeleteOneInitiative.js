"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE,
    async execute(io, socket, client, data) {
        try {
            const { deleteSingle, getSession, updateSession, } = require("../../services/database-common");
            if (data.docId !== undefined) {
                let finalMessage = await deleteSingle(data.docId, data.sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
                if (finalMessage instanceof Error) {
                    weapon_of_logging.alert({
                        message: finalMessage.message,
                        function: ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE,
                        docId: data.docId,
                    });
                }
                let [isSorted, onDeck, sessionSize] = await getSession(data.sessionId);
                sessionSize -= 1;
                isSorted = false;
                onDeck = 0;
                let errorMsg = await updateSession(data.sessionId, onDeck, isSorted, sessionSize);
                weapon_of_logging.debug({ message: "emitting update and deletion", function: ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE });
                socket.broadcast.to(data.sessionId).emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_SESSION, false);
                socket.broadcast
                    .to(data.sessionId)
                    .emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ONE_INITIATIVE, data.docId);
                if (errorMsg instanceof Error) {
                    weapon_of_logging.alert({
                        message: errorMsg.message,
                        function: "DELETE_ONE SocketReceiver",
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "DELETE_ONE SocketReceiver",
                });
            }
        }
    },
};

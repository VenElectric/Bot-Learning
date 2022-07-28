"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
    async execute(io, socket, client, data) {
        const { updatecollectionRecord, } = require("../../services/database-common");
        weapon_of_logging.debug({
            message: "updating one value",
            function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
            docId: data.payload.id,
        });
        try {
            await updatecollectionRecord(data.payload, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE, data.payload.id, data.sessionId);
            weapon_of_logging.debug({
                message: "update complete, broadcasting to room",
                function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
                docId: data.payload.id,
            });
            socket.broadcast
                .to(data.sessionId)
                .emit(ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE, data.payload);
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: ServerCommunicationTypes_1.EmitTypes.UPDATE_RECORD_INITIATIVE,
                    docId: data.payload.id,
                });
            }
        }
    },
};

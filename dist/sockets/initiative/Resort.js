"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.RESORT,
    async execute(io, socket, client, sessionId, respond) {
        const { retrieveCollection } = require("../../services/database-common");
        const { resortInitiative } = require("../../services/initiative");
        let initiativeList = (await retrieveCollection(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
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
    }
};

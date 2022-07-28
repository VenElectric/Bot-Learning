"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const database_common_1 = require("../../services/database-common");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE,
    async execute(io, socket, client) {
        socket.on(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE, async function (sessionId) {
            try {
                await (0, database_common_1.deleteCollection)(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
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
    }
};

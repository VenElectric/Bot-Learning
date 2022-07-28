"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.NEXT,
    async execute(io, socket, client, sessionId) {
        const { channelSend } = require("../util");
        const { turnOrder } = require("../../services/initiative");
        const { retrieveRecord } = require("../../services/database-common");
        const { statusEmbed } = require("../../services/create-embed");
        const [errorMsg, currentName, currentStatuses, currentId] = await turnOrder(sessionId, ServerCommunicationTypes_1.EmitTypes.NEXT);
        weapon_of_logging.debug({
            message: "next turn and statuses retrieved",
            function: ServerCommunicationTypes_1.EmitTypes.NEXT,
            docId: currentId,
        });
        if (errorMsg instanceof Error) {
            weapon_of_logging.alert({
                message: errorMsg.message,
                function: ServerCommunicationTypes_1.EmitTypes.NEXT,
            });
        }
        weapon_of_logging.info({
            message: "succesfully retrieved next",
            function: ServerCommunicationTypes_1.EmitTypes.NEXT,
        });
        setTimeout(async () => {
            let record = await retrieveRecord(currentId, sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
            weapon_of_logging.info({
                message: record,
                function: ServerCommunicationTypes_1.EmitTypes.NEXT,
            });
            io.to(sessionId).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, record);
            const statuses = statusEmbed(currentName, currentStatuses);
            channelSend(client, { embeds: [statuses] }, sessionId);
        }, 300);
    },
};

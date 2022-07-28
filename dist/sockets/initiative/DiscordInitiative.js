"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
const util_1 = require("../util");
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DISCORD_INITIATIVE,
    async execute(io, socket, client, sessionId) {
        const { retrieveCollection, getSession } = require("../../services/database-common");
        const { resortInitiative, finalizeInitiative } = require("../../services/initiative");
        const { initiativeEmbed } = require("../../services/create-embed");
        let sortedList;
        try {
            let newList = (await retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.INITIATIVE));
            weapon_of_logging.info({
                message: `retrieving initiative for discord embed`,
                function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
            });
            let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
            if (isSorted) {
                sortedList = resortInitiative(newList);
            }
            else {
                sortedList = await finalizeInitiative(newList, false, sessionId);
            }
            let initEmbed = initiativeEmbed(sortedList);
            (0, util_1.channelSend)(client, { embeds: [initEmbed] }, sessionId);
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: ServerCommunicationTypes_1.EmitTypes.DISCORD,
                });
            }
        }
    },
};

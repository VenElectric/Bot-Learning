"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCommunicationTypes_1 = require("../../Interfaces/ServerCommunicationTypes");
const util_1 = require("../util");
const weapon_of_logging = require("../../utilities/LoggerConfig").logger;
module.exports = {
    name: ServerCommunicationTypes_1.EmitTypes.DISCORD_SPELLS,
    async execute(io, socket, client, sessionId) {
        const { retrieveCollection, } = require("../../services/database-common");
        const { spellEmbed } = require("../../services/create-embed");
        let newList = (await retrieveCollection(sessionId, ServerCommunicationTypes_1.collectionTypes.SPELLS));
        weapon_of_logging.info({
            message: `retrieving spells for discord embed`,
            function: ServerCommunicationTypes_1.EmitTypes.DISCORD_SPELLS,
        });
        weapon_of_logging.debug({
            message: newList,
            function: ServerCommunicationTypes_1.EmitTypes.DISCORD_SPELLS,
        });
        let spellsEmbed = spellEmbed(newList);
        (0, util_1.channelSend)(client, { embeds: [spellsEmbed] }, sessionId);
    },
};

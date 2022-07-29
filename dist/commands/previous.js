"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("discord.js");
const { turnOrder, initiativeFunctionTypes, } = require("../services/initiative");
const database_common_1 = require("../services/database-common");
const index_1 = require("../index");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const create_embed_1 = require("../services/create-embed");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Move Turn Order Backwards"),
    description: `Move the initiative order back.`,
    async execute(interaction) {
        let [errorMsg, currentTurn, currentStatuses, currentId] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.PREVIOUS);
        const statuses = (0, create_embed_1.statusEmbed)(currentTurn, currentStatuses);
        if (errorMsg instanceof Error) {
            weapon_of_logging.alert({ message: errorMsg.message, function: "next" });
        }
        weapon_of_logging.info({
            message: "previous turn success",
            function: "next",
        });
        setTimeout(async () => {
            let record = await (0, database_common_1.retrieveRecord)(currentId, interaction.channel.id, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
            index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, record);
        }, 300);
        await interaction.reply({ embeds: [statuses] });
    },
};

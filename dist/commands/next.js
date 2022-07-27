"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder, initiativeFunctionTypes, } = require("../services/initiative");
const create_embed_1 = require("../services/create-embed");
const index_1 = require("../index");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const database_common_1 = require("../services/database-common");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("next")
        .setDescription("Move turn order forward"),
    async execute(interaction) {
        try {
            let [errorMsg, currentTurn, currentStatuses, currentId] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.NEXT);
            weapon_of_logging.debug({
                message: "after turnorder function",
                function: "next",
            });
            const statuses = (0, create_embed_1.statusEmbed)(currentTurn, currentStatuses);
            if (errorMsg instanceof Error) {
                weapon_of_logging.alert({
                    message: errorMsg.message,
                    function: "next",
                });
            }
            else {
                weapon_of_logging.info({
                    message: "next turn success",
                    function: "next",
                });
            }
            setTimeout(async () => {
                let record = await (0, database_common_1.retrieveRecord)(currentId, interaction.channel.id, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE);
                console.log(record);
                index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.NEXT, record);
            }, 300);
            await interaction.reply({ embeds: [statuses] });
        }
        catch (error) {
            console.log(error);
            weapon_of_logging.warning({ message: error, function: "next" });
        }
    },
};

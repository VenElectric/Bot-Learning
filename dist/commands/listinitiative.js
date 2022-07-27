"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// get session embed (initiative list in table format)
const { SlashCommandBuilder } = require("@discordjs/builders");
const initiative_1 = require("../services/initiative");
const database_common_1 = require("../services/database-common");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const create_embed_1 = require("../services/create-embed");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
// import { webComponent, devWeb } from "../services/constants"
// const { hyperlink } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("listinitiative")
        .setDescription("Create an embed that shows initiative"),
    async execute(interaction) {
        let sessionId = interaction.channel.id;
        try {
            let newList = (await (0, database_common_1.retrieveCollection)(sessionId, ServerCommunicationTypes_1.secondLevelCollections.INITIATIVE));
            weapon_of_logging.info({ message: "getting initiative records", function: "listinitiative" });
            let [isSorted, onDeck, sessionSize] = await (0, database_common_1.getSession)(sessionId);
            let sortedList = (0, initiative_1.resortInitiative)(newList);
            let initEmbed = (0, create_embed_1.initiativeEmbed)(sortedList);
            weapon_of_logging.debug({ message: "sorted initiative and creating embed", function: "listinitiative" });
            await interaction.reply({ embeds: [initEmbed] });
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({ message: error.message, function: "listinitiative" });
            }
        }
    },
};

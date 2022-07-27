"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { db } = require("../services/firebase-setup");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
const database_common_1 = require("../services/database-common");
const index_1 = require("../index");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearsessionlist")
        .setDescription("Clear all initiative and spells for this session."),
    async execute(interaction) {
        try {
            let sessionId = interaction.channel.id;
            await (0, database_common_1.deleteSession)(sessionId);
            weapon_of_logging.debug({
                message: "reset of spells and initiative",
                function: "clearsessionlist",
            });
            index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_INITIATIVE);
            index_1.io.to(interaction.channel.id).emit(ServerCommunicationTypes_1.EmitTypes.DELETE_ALL_SPELL);
            await interaction.reply("Reset Complete");
        }
        catch (error) {
            console.log("error", error);
        }
    },
};

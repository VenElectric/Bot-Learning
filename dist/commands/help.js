"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const constants_1 = require("../services/constants");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const wait = require('util').promisify(setTimeout);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help with commands"),
    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(new SelectMenuBuilder()
            .setCustomId("helpmenu")
            .setPlaceholder("Nothing selected")
            .addOptions(constants_1.helpMenu));
        weapon_of_logging.info({ message: "sending help menu", function: "help" });
        await interaction.reply({ content: "Select a command", components: [row] });
    },
};

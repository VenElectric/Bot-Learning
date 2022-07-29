"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("blue")
        .setDescription("Use this card if you need to take a break (bathroom, snacks, etc.)"),
    async execute(interaction) {
        const consentEmbed = consentCardEmbed(ConsentCards.BLUE, interaction.user.username);
        await interaction.reply({ embeds: [consentEmbed] });
    },
};

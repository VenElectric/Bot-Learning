"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("white")
        .setDescription("Use if you need to interject or ask a question."),
    async execute(interaction) {
        const consentEmbed = consentCardEmbed(ConsentCards.WHITE, interaction.user.username);
        await interaction.reply({ embeds: [consentEmbed] });
    },
};

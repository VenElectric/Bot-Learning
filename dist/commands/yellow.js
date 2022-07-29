"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("yellow")
        .setDescription("Use if you are feeling uncomfortable and need things to slow down."),
    async execute(interaction) {
        const consentEmbed = consentCardEmbed(ConsentCards.YELLOW, interaction.user.username);
        const button = new ButtonBuilder()
            .setCustomId('')
            .setLabel('Primary')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);
        await interaction.reply({ embeds: [consentEmbed] });
    },
};

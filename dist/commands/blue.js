"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("blue")
        .setDescription("Use this card if you need to take a break (bathroom, snacks, etc.)"),
    description: "Use this card if you need to take a break (bathroom, snacks, etc.)",
    async execute(interaction) {
        const { embed, file } = consentCardEmbed(ConsentCards.BLUE, interaction.user.username);
        await interaction.reply({
            content: "@here",
            embeds: [embed],
            files: [file],
        });
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("yellow")
        .setDescription("Use if you are feeling uncomfortable and need things to slow down."),
    description: "Use if you are feeling uncomfortable and need things to slow down.",
    async execute(interaction) {
        const { embed, file } = consentCardEmbed(ConsentCards.YELLOW, interaction.user.username);
        await interaction.reply({
            content: "@here",
            embeds: [embed],
            files: [file],
        });
    },
};

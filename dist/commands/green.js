"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("green")
        .setDescription("Use this card if you want to express you are fine roleplaying the tense situation."),
    description: "Use this card if you want to express you are fine roleplaying the tense situation.",
    async execute(interaction) {
        const { embed, file } = consentCardEmbed(ConsentCards.GREEN, interaction.user.username);
        await interaction.reply({ content: "@here", embeds: [embed], files: [file] });
    },
};

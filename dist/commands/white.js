"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("white")
        .setDescription("Use if you need to interject or ask a question."),
    description: "Use if you need to interject or ask a question.",
    async execute(interaction) {
        const { embed, file } = consentCardEmbed(ConsentCards.WHITE, interaction.user.username);
        await interaction.reply({ content: "@here", embeds: [embed], files: [file] });
    },
};

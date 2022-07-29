"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { consentCardEmbed } = require("../services/create-embed");
const { ConsentCards } = require("../services/constants");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("red")
        .setDescription("Use this card if you need to stop the session immediately/boundaries were passed."),
    async execute(interaction) {
        const consentEmbed = await consentCardEmbed(ConsentCards.RED, interaction.user.username);
        await interaction.reply({ embeds: [consentEmbed] });
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType, SlashCommandBuilder } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("echo")
        .setType(ApplicationCommandType.User),
    async execute() {
        return;
    },
};

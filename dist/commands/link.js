"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("Get the link for the web component."),
    description: `Get the link to your session's web page component.`,
    async execute(interaction) {
        weapon_of_logging.info({ message: "sending link url", function: "link" });
        let url = `${process.env.HOST_URL}/session/${interaction.channel.id}`;
        weapon_of_logging.debug({ message: process.env.HOST_URL, function: "link" });
        await interaction.reply(`Here is the URL for your session: ${url} \nThis URL is specific to this channel. If you need to change the session to a different text channel then please use the /changechannel slash command.`);
        console.log("replying interaction");
    },
};

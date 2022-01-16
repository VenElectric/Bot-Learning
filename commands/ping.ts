const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import { addBash } from "../services/parse";
import {weapon_of_logging} from "../utilities/LoggingClass";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: any) {
    weapon_of_logging.CRITICAL("test","testMessage","stacktrace","data")
    interaction.reply("Pong")
  },
};

export {};

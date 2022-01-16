const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import { addBash } from "../services/parse";
const weapon_of_logging = require("../utilities/LoggerConfig").logger

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: any) {
    weapon_of_logging.error({message: "send to discord channel test", function:"ping"})
    interaction.reply("Pong")
  },
};

export {};

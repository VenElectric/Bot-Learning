const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
import { helpMenu } from "../services/constants";
const weapon_of_logging = require("../utilities/LoggerConfig").logger
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help with commands"),
  async execute(interaction: any) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("helpmenu")
        .setPlaceholder("Nothing selected")
        .addOptions(helpMenu)
    )
    weapon_of_logging.info({message: "sending help menu", function:"help"})
    await interaction.reply({ content: "Select a command", components: [row] })
  },
};

export {};

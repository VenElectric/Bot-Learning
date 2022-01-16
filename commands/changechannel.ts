import { weapon_of_logging } from "../utilities/LoggingClass";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changechannel")
    .setDescription("Change the channel of your game session."),
  async execute(interaction: any) {
    let menuChannels: any[] = [];
    try {
      let guildChannels = await interaction.guild.channels.fetch();
      guildChannels.forEach((item: any) => {
        if (item.type !== "GUILD_CATEGORY" && item.type !== "GUILD_VOICE") {
          weapon_of_logging.DEBUG(
            "changechannel",
            "add in new channel to menu",
            { channelName: item.name, channelId: item.id }
          );
          menuChannels.push({
            label: item.name,
            value: item.id,
          });
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.CRITICAL(
          error.name,
          "Uncaught error in changchannel",
          error.stack,
          error.message
        );
      }
    }
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("changechannel")
        .setPlaceholder("Nothing selected")
        .addOptions(menuChannels)
    );
    weapon_of_logging.INFO("changechannel", "Replying to interaction with created select menu", "none");
    await interaction.reply({
      content: "Select a new channel for your session.",
      components: [row],
    });
  },
};

export {};

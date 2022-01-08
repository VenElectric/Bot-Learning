import { Intents } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changechannel")
    .setDescription("Change the channel of your game session."),
  async execute(interaction: any) {
    let menuChannels: any[] = [];
    let guildChannels = await interaction.guild.channels.fetch();
    // console.log(guildChannels);
    guildChannels.forEach((item: any) => {
      if (item.type !== "GUILD_CATEGORY" && item.type !== "GUILD_VOICE") {
        menuChannels.push({
          label: item.name,
          value: item.id,
        });
      }
    });
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("changechannel")
        .setPlaceholder("Nothing selected")
        .addOptions(menuChannels)
    );
    // transfer docs or use UUID for doc id (like we were doing)
    await interaction.reply({
      content: "Select a new channel for your session.",
      components: [row],
    });
  },
};

export {};

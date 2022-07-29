"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("My Test Command"),
    async execute(interaction) {
        const color = { name: "Blue", value: "#0056FF" };
        const consentEmbed = new EmbedBuilder()
            .setTitle(color.name)
            .setColor(color.value)
            .setDescription(color.value)
            .addFields({ name: "Inline field title", value: "Press for an interaction" }, { name: "\u200B", value: "\u200B" })
            .setTimestamp();
        const button = new ButtonBuilder()
            .setCustomId('primary')
            .setLabel('Primary')
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(button);
        await interaction.reply({ embeds: [consentEmbed], components: [row] });
        // const thread = await interaction.channel.threads.create({
        //     name: 'test-thread',
        //     autoArchiveDuration: 60,
        //     reason: 'Needed a separate thread for food',
        // });
        // if (thread.joinable) await thread.join();
        // setTimeout(async () => {
        //     await thread.delete();
        // },3000)
        // console.log(`Created thread: ${thread.name}`);
        // await interaction.reply()
    },
};

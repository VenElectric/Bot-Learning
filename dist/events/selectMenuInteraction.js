"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { EmbedBuilder } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(commands, interaction) {
        if (!interaction.isSelectMenu())
            return;
        await interaction.deferReply();
        try {
            if (interaction.customId === "helpmenu") {
                const command = await commands.get(interaction.values[0]);
                if (command) {
                    const helpEmbed = new EmbedBuilder()
                        .setTitle(interaction.values[0])
                        .addFields({
                        name: "\u200b",
                        value: command.description,
                        inline: false,
                    });
                    await interaction.editReply({
                        embeds: [helpEmbed],
                        components: [],
                    });
                }
            }
            if (interaction.customId === "changechannel") {
                let channelName = await interaction?.guild?.channels.fetch(interaction.values[0]);
                await interaction.editReply({
                    content: `Your channel has been changed to ${channelName?.name}`,
                    components: [],
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                weapon_of_logging.alert({
                    message: error.message,
                    function: "interactioncreate for menus",
                });
                interaction.editReply({ content: "There was an error with this command", components: [] });
                return;
            }
        }
        // help menu
    },
};

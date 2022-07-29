"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { MessageEmbed } = require("discord.js");
const constants_1 = require("../services/constants");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(commands, interaction) {
        if (!interaction.isSelectMenu())
            return;
        console.log("selectMenu");
        try {
            if (interaction.customId === "helpmenu") {
                await interaction.deferUpdate();
                const helpEmbed = new MessageEmbed()
                    .setTitle(interaction.values[0])
                    .addField("\u200b", constants_1.commandDescriptions[`${interaction.values[0]}`].description, false)
                    .setImage(constants_1.commandDescriptions[`${interaction.values[0]}`].image);
                console.log(helpEmbed);
                await interaction.editReply({
                    embeds: [helpEmbed],
                    components: [],
                });
            }
            if (interaction.customId === "changechannel") {
                let channelName = await interaction?.guild?.channels.fetch(interaction.values[0]);
                await interaction.deferUpdate();
                await interaction.editReply({
                    content: `Your channel has been changed to ${channelName?.name}`,
                    components: [],
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                weapon_of_logging.alert({
                    message: error.message,
                    function: "interactioncreate for menus",
                });
                return;
            }
        }
        // help menu
    },
};

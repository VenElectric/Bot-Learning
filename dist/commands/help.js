"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder, AttachmentBuilder, } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const wait = require("util").promisify(setTimeout);
const { retrieveMenu, MenuType } = require("../services/SelectMenuItemsCreation");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help with commands"),
    description: "Select an option from the menu to get more information about the command.",
    async execute(commands, interaction) {
        try {
            const helpMenu = retrieveMenu(MenuType.HELP_MENU);
            console.log(helpMenu);
            const row = new ActionRowBuilder().addComponents(new SelectMenuBuilder()
                .setCustomId("helpmenu")
                .setPlaceholder("Nothing selected")
                .addOptions(helpMenu));
            weapon_of_logging.info({
                message: "sending help menu",
                function: "help",
            });
            await interaction.reply({
                content: "Select a command",
                components: [row],
            });
        }
        catch (error) {
            console.log(error);
            await interaction.reply("There was an error with this command.");
        }
    },
};

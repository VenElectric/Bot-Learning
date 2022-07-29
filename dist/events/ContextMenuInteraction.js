"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
// import {commands} from "../index";
module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(commands, interaction) {
        if (!interaction.isUserContextMenuCommand())
            return;
        // Get the User's username from context menu
        const name = interaction.targetUser.username;
        console.log(name);
        await interaction.reply("Testing, thank you");
    },
};

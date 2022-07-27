"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ModalBuilder } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(commands, interaction) {
        if (!interaction.isChatInputCommand())
            return;
        if (interaction.commandName === 'ping') {
            const modal = new ModalBuilder()
                .setCustomId('myModal')
                .setTitle('My Modal');
            // TODO: Add components to modal...
            await interaction.showModal(modal);
        }
    },
};

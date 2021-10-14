"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { evaluate } = require('mathjs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("maths")
        .setDescription("Replies with Pong!"),
    async execute(message) {
        await message.reply(`Answer: ${evaluate(message.content)}`);
    },
};

const { SlashCommandBuilder } = require("@discordjs/builders");
const {evaluate} = require('mathjs')
import { Message } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("maths")
		.setDescription("Replies with Pong!"),
	async execute(message:Message) {
		await message.reply(`Answer: ${evaluate(message.content)}`);
	},
};

export {}
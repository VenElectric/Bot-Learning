const { SlashCommandBuilder } = require("@discordjs/builders");
const {evaluate} = require('mathjs')
import { Message } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("maths")
		.setDescription("1+1 = ?"),
	async execute(message:Message) {
		try{
			let answer = evaluate(message.content)
			await message.reply(`Answer: ${answer}`);
		}
		catch (error){
			if (error instanceof Error) {
				await message.reply(error.message);
			  }
		}
		
	},
};

export {}
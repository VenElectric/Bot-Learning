const { SlashCommandBuilder } = require("@discordjs/builders");
const {evaluate} = require('mathjs')
import { Message } from "discord.js";
import { weapon_of_logging } from "../utilities/LoggingClass";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("maths")
		.setDescription("1+1 = ?"),
	async execute(message:Message) {
		try{
			let answer = evaluate(message.content)
			weapon_of_logging.INFO("math", "Calculation complete", answer)
			await message.reply(`Answer: ${answer}`);
		}
		catch (error){
			if (error instanceof Error) {
				await message.reply(error.message);
				
					weapon_of_logging.CRITICAL(
						error.name,
						error.message,
						error.stack,
						message.content,
					  );
			  }
			  
		}
		
	},
};

export {}
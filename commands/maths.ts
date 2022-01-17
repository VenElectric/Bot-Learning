const { SlashCommandBuilder } = require("@discordjs/builders");
const {evaluate} = require('mathjs')
import { Message } from "discord.js";
const weapon_of_logging = require("../utilities/LoggerConfig").logger

module.exports = {
	data: new SlashCommandBuilder()
		.setName("maths")
		.setDescription("1+1 = ?"),
	async execute(message:Message) {
		try{
			let answer = evaluate(message.content)
			weapon_of_logging.info({message: "math calculation completed", function:"maths"})
			await message.reply(`Answer: ${answer}`);
		}
		catch (error){
			if (error instanceof Error) {
				await message.reply(error.message);
				
					weapon_of_logging.error(
						{message: error.message, function:"maths"}
					  );
			  }
			  
		}
		
	},
};

export {}
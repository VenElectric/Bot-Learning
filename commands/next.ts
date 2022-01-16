import { weapon_of_logging } from "../utilities/LoggingClass";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder,initiativeFunctionTypes } = require("../services/initiative")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("next")
		.setDescription("Move turn order forward"),
	async execute(interaction:any) {
		let [errorMsg, currentTurn] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.NEXT)
		if (errorMsg instanceof Error){
			weapon_of_logging.CRITICAL(
				errorMsg.name,
				errorMsg.message,
				errorMsg.stack,
				currentTurn
			  );
		}
		else{
			weapon_of_logging.INFO("next", "successfully completed next command",currentTurn)
		}
		await interaction.reply(`Current Turn: ${currentTurn}`);
	},
};

export {}

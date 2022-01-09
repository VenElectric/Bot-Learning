import { weapon_of_logging } from "../utilities/LoggingClass";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder,initiativeFunctionTypes } = require("../services/initiative")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("prev")
		.setDescription("Move Turn Order Backwards"),
	async execute(interaction:any) {
		let sessionId = interaction.channel.id
		let [errorMsg, currentTurn] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.PREVIOUS)

		if (errorMsg instanceof Error){
			weapon_of_logging.CRITICAL(
				errorMsg.name,
				errorMsg.message,
				errorMsg.stack,
				currentTurn,
				sessionId
			  );
		}
		weapon_of_logging.INFO("currentTurn", "none", currentTurn,sessionId)
			await interaction.reply(`Current Turn: ${currentTurn}`);
	},
};

export {}
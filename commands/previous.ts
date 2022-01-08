const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder,initiativeFunctionTypes } = require("../services/initiative")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("prev")
		.setDescription("Move Turn Order Backwards"),
	async execute(interaction:any) {
		let [errorMsg, currentTurn] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.PREVIOUS)
		console.log(errorMsg) // better error logging and handling
		await interaction.reply(`Current Turn: ${currentTurn}`);
	},
};

export {}
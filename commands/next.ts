const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder,initiativeFunctionTypes } = require("../services/initiative")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("next")
		.setDescription("Move turn order forward"),
	async execute(interaction:any) {
		let [errorMsg, currentTurn] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.NEXT)
		console.log(errorMsg) // better error logging and handling
		await interaction.reply(`Current Turn: ${currentTurn}`);
	},
};

export {}

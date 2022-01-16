const weapon_of_logging = require("../utilities/LoggerConfig").logger

const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder,initiativeFunctionTypes } = require("../services/initiative")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("prev")
		.setDescription("Move Turn Order Backwards"),
	async execute(interaction:any) {
		let [errorMsg, currentTurn] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.PREVIOUS)

		if (errorMsg instanceof Error){
			weapon_of_logging.error(
				{message: errorMsg.message, function:"next"}
			  );
		}
		weapon_of_logging.info({message: "previous turn success", function:"next"})
			await interaction.reply(`Current Turn: ${currentTurn}`);
	},
};

export {}
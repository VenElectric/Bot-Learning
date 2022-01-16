const weapon_of_logging = require("../utilities/LoggerConfig").logger

const { SlashCommandBuilder } = require("@discordjs/builders");
const { turnOrder,initiativeFunctionTypes } = require("../services/initiative")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("next")
		.setDescription("Move turn order forward"),
	async execute(interaction:any) {
		let [errorMsg, currentTurn] = await turnOrder(interaction.channel.id, initiativeFunctionTypes.NEXT)
		if (errorMsg instanceof Error){
			weapon_of_logging.error(
				{message: errorMsg.message, function:"next"}
			  );
		}
		else{
			weapon_of_logging.info({message: "next turn success", function:"next"});
		}
		await interaction.reply(`Current Turn: ${currentTurn}`);
	},
};

export {}

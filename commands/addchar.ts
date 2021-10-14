const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("addchar")
		.setDescription("Replies with Pong!"),
	async execute(interaction:any) {
		await interaction.reply("Pong!");
	},
};

export {}
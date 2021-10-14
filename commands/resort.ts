const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("resort")
		.setDescription("Replies with Pong!"),
	async execute(interaction:any) {
		await interaction.reply("Pong!");
	},
};

export {}
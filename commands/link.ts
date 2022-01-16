import { weapon_of_logging } from "../utilities/LoggingClass";

const { SlashCommandBuilder } = require("@discordjs/builders");
// import { webComponent, devWeb } from "../services/constants"
// const { hyperlink } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("link")
		.setDescription("Get the link for the web component."),
	async execute(interaction:any) {
		weapon_of_logging.INFO("link", "sending URL","none")
		await interaction.reply("Website is down for maintenance!")
		// let url = `${devWeb}/session/${interaction.channel.id}`
		// await interaction.reply(`Here is the URL for your session: ${url} \nThis URL is specific to this channel. If you need to change the session to a different text channel then please use the /changechannel slash command.`);
	},
};

export {}
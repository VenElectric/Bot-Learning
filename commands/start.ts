const { SlashCommandBuilder } = require("@discordjs/builders");
const { finalizeInitiative } = require("../services/initiative")
const { db } = require("../services/firebase-setup");
const { createEmbed } = require("../services/create-embed");
import { IInit } from "../Interfaces/IInit";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("start")
		.setDescription("Start Initiative and reset turn order."),
	async execute(interaction:any) {
	try{
		let initiativeSnap = await db.collection("sessions").doc(interaction.channel.id).collection("initiative").get()
		let initiativeList = [] as IInit[];
		let newList;

		initiativeSnap.forEach((doc:any) => {
			let record = doc.data() as IInit
			record.isCurrent = false;
			console.log(record)
			initiativeList.push(record)
		})
		
		newList = await finalizeInitiative(initiativeList,true,interaction.channel.id,2,true)
		console.log(newList, "newList")

		let initiativeEmbed = createEmbed(newList);

		await interaction.reply({content: "Rounds have been started.", embeds: [initiativeEmbed]});
	}
	catch(error){
		console.log(error)
	}
		
	},
};

export {}
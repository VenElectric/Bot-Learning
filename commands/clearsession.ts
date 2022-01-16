const { SlashCommandBuilder } = require("@discordjs/builders");
const { db } = require("../services/firebase-setup");
import {weapon_of_logging} from "../utilities/LoggingClass";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clearsessionlist")
		.setDescription("Clear all initiative and spells for this session."),
	async execute(interaction:any) {
		try{
			let sessionId = interaction.channel.id;
			const initRef = db.collection('sessions').doc(sessionId)
			const initSnapshot = await initRef.collection("initiative").get()
			const spellSnapshot = await initRef.collection("spells").get()
			const batch = db.batch();
			initSnapshot.docs.forEach((doc:any)=>{
				batch.delete(doc.ref);
			})
			spellSnapshot.docs.forEach((doc:any) => {
				batch.delete(doc.ref);
			})
			await batch.commit();
			weapon_of_logging.DEBUG("clearsession","successful deletion of spells and initiative","none")
			await interaction.reply("Reset Complete");
		}
		catch(error){
			console.log("error", error)
		}
		
	},
};

export {}
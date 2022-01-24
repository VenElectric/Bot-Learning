const { SlashCommandBuilder } = require("@discordjs/builders");
const { db } = require("../services/firebase-setup");
const weapon_of_logging = require("../utilities/LoggerConfig").logger

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


			initRef.set({isSorted: false, onDeck: 0, sessionSize: 0}, {merge: true}).then(() => {
				weapon_of_logging.debug({message: "reset of session values successufl", function:"clearsessionlist"})
			}).catch((error: any) => {
				if (error instanceof Error){
					weapon_of_logging.alert({message: "error resetting session values", function:"clearsessionlist"});
				}
			})
			initSnapshot.docs.forEach((doc:any)=>{
				batch.delete(doc.ref);
			})
			spellSnapshot.docs.forEach((doc:any) => {
				batch.delete(doc.ref);
			})
			await batch.commit();
			weapon_of_logging.debug({message: "reset of spells and initiative", function:"clearsessionlist"})
			await interaction.reply("Reset Complete");
		}
		catch(error){
			console.log("error", error)
		}
		
	},
};

export {}
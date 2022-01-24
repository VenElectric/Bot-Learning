const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  finalizeInitiative,
  retrieveSession,
} = require("../services/initiative");
const { db } = require("../services/firebase-setup");
const { createEmbed } = require("../services/create-embed");
import {InitiativeObject} from "../Interfaces/GameSessionTypes";
const weapon_of_logging = require("../utilities/LoggerConfig").logger

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resort")
    .setDescription("Resort initiative and keep turn order."),
  async execute(interaction: any) {
	let newList;
    try {
      let snapshot = await db
        .collection("sessions")
        .doc(interaction.channel.id)
        .get();


      let initiativeList = await retrieveSession(interaction.channel.id);
      weapon_of_logging.info({message: "successfully retrieved session data", function:"resort"});
      if (snapshot.data().isSorted) {
        newList = await finalizeInitiative(
          initiativeList,
          false,
          interaction.channel.id,
          2,
          true
        );
        weapon_of_logging.debug({message: "isSorted is true", function:"resort"})
      }
      if (!snapshot.data().isSorted){
        weapon_of_logging.debug({message: "isSorted is false", function:"resort"})
        await interaction.reply("Initiative has not been sorted yet. Please use the /start command.")
      }
      if (snapshot.data().isSorted === undefined) {
        for (let item in initiativeList) {
          initiativeList[item].isCurrent = false;
        }
        newList = await finalizeInitiative(
          initiativeList,
          true,
          interaction.channel.id,
          2,
          false
        );
        weapon_of_logging.debug({message: "isSorted is undefined", function:"resort"})
      }

      let initiativeEmbed = createEmbed(newList);
      weapon_of_logging.info({message: "resort complete", function:"resort"});
      await interaction.reply({
        content: "Initiative has been resorted.",
        embeds: [initiativeEmbed],
      });
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.alert(
          {message: error.message, function:"resort"}
        );
      }
    }
  },
};

export {};

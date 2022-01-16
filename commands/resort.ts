const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  finalizeInitiative,
  retrieveSession,
} = require("../services/initiative");
const { db } = require("../services/firebase-setup");
const { createEmbed } = require("../services/create-embed");
import {InitiativeObject} from "../Interfaces/GameSessionTypes";
import { weapon_of_logging } from "../utilities/LoggingClass";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resort")
    .setDescription("Resort initiative and keep turn order."),
  async execute(interaction: any) {
	let newList;
	let sessionId = interaction.channel.id
    try {
      let snapshot = await db
        .collection("sessions")
        .doc(interaction.channel.id)
        .get();


      let initiativeList = await retrieveSession(interaction.channel.id);
      weapon_of_logging.INFO("resort", "retrieved initiativeList", initiativeList);
      if (snapshot.data().isSorted) {
        newList = await finalizeInitiative(
          initiativeList,
          false,
          interaction.channel.id,
          2,
          true
        );
        weapon_of_logging.DEBUG("resort", "isSorted is true",snapshot.data().isSorted)
      }
      if (!snapshot.data().isSorted){
        weapon_of_logging.DEBUG("resort", "isSorted is false",snapshot.data().isSorted)
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
        weapon_of_logging.DEBUG("resort", "isSorted is undefined",snapshot.data().isSorted)
      }

      let initiativeEmbed = createEmbed(newList);
      weapon_of_logging.INFO("resort", "resort complete",newList);
      await interaction.reply({
        content: "Initiative has been resorted.",
        embeds: [initiativeEmbed],
      });
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.CRITICAL(
          error.name,
          error.message,
          error.stack,
          newList
        );
      }
    }
  },
};

export {};

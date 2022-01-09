const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  finalizeInitiative,
  retrieveSession,
} = require("../services/initiative");
const { db } = require("../services/firebase-setup");
const { createEmbed } = require("../services/create-embed");
import { IInit } from "../Interfaces/IInit";
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

      let initiativeList = [] as IInit[];

      initiativeList = await retrieveSession(interaction.channel.id);

      if (snapshot.data().isSorted) {
        newList = await finalizeInitiative(
          initiativeList,
          false,
          interaction.channel.id,
          2,
          true
        );
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
      }

      let initiativeEmbed = createEmbed(newList);

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
          newList,
          sessionId
        );
      }
    }
  },
};

export {};

const { SlashCommandBuilder } = require("@discordjs/builders");
const { finalizeInitiative } = require("../services/initiative");
const { db } = require("../services/firebase-setup");
const { createEmbed } = require("../services/create-embed");
import { IInit } from "../Interfaces/IInit";
import { weapon_of_logging } from "../utilities/LoggingClass";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start Initiative and reset turn order."),
  async execute(interaction: any) {
    let newList;
    let sessionId = interaction.channel.id;
    try {
      let initiativeSnap = await db
        .collection("sessions")
        .doc(interaction.channel.id)
        .collection("initiative")
        .get();
      let initiativeList = [] as IInit[];

      initiativeSnap.forEach((doc: any) => {
        let record = doc.data() as IInit;
        record.isCurrent = false;
        console.log(record);
        initiativeList.push(record);
      });

      newList = await finalizeInitiative(
        initiativeList,
        true,
        interaction.channel.id,
        2,
        true
      );
      weapon_of_logging.INFO("start", "newList data", newList, sessionId);
      console.log(newList, "newList");

      let initiativeEmbed = createEmbed(newList);

      await interaction.reply({
        content: "Rounds have been started.",
        embeds: [initiativeEmbed],
      });
    } catch (error) {
      console.log(error);
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

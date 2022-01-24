const { SlashCommandBuilder } = require("@discordjs/builders");
const { finalizeInitiative } = require("../services/initiative");
const { db } = require("../services/firebase-setup");
const { createEmbed } = require("../services/create-embed");
import { InitiativeObject } from "../Interfaces/GameSessionTypes";
const weapon_of_logging = require("../utilities/LoggerConfig").logger

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start Initiative and reset turn order."),
  async execute(interaction: any) {
    let newList;
    try {
      let initiativeSnap = await db
        .collection("sessions")
        .doc(interaction.channel.id)
        .collection("initiative")
        .get();
      let initiativeList = [] as InitiativeObject[];
      weapon_of_logging.debug( {message: "retrieved initiative data from database", function:"start"});

      initiativeSnap.forEach((doc: any) => {
        let record = doc.data() as InitiativeObject;
        record.isCurrent = false;
        initiativeList.push(record);
        weapon_of_logging.debug( {message: "reset isCurrent", function:"start"});
      });

      newList = await finalizeInitiative(
        initiativeList,
        true,
        interaction.channel.id,
        2,
        true
      );
      weapon_of_logging.info( {message: "finalize initiative complete", function:"start"});

      let initiativeEmbed = createEmbed(newList);

      weapon_of_logging.debug( {message: "embed created", function:"start"});

      await interaction.reply({
        content: "Rounds have been started.",
        embeds: [initiativeEmbed],
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        weapon_of_logging.alert(
          {message: error.message, function:"start"}
        );
      }
    }
  },
};

export {};

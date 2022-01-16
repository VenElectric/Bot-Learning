// get session embed (initiative list in table format)
const { SlashCommandBuilder } = require("@discordjs/builders");
import { finalizeInitiative } from "../services/initiative";
import { retrieveCollection, getSession } from "../services/database-common";
import { weapon_of_logging } from "../utilities/LoggingClass";
import { InitiativeObject } from "../Interfaces/GameSessionTypes";
import { initiativeEmbed } from "../services/create-embed";
// import { webComponent, devWeb } from "../services/constants"
// const { hyperlink } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listinitiative")
    .setDescription("Create an embed that shows initiative"),
  async execute(interaction: any) {
    let sessionId = interaction.channel.id;
    try {
      let newList = (await retrieveCollection(
        sessionId,
        "initiative"
      )) as InitiativeObject[];
      weapon_of_logging.INFO(
        "listinitiative",
        "getting initiative list",
        newList
      );
      let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
      let sortedList = await finalizeInitiative(
        newList,
        isSorted,
        sessionId,
        onDeck,
        isSorted
      );
      let initEmbed = initiativeEmbed(sortedList);
      weapon_of_logging.DEBUG(
        "listinitiative",
        "sorted Initiative and created embed",
        sortedList
      );
      await interaction.reply({ embeds: [initEmbed] });
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.CRITICAL(
          "listinitiative",
          "uncaught error",
          error.stack,
          error.message
        );
      }
    }
  },
};

export {};

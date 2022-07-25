// get session embed (initiative list in table format)
const { SlashCommandBuilder } = require("@discordjs/builders");
import { finalizeInitiative, resortInitiative } from "../services/initiative";
import { retrieveCollection, getSession } from "../services/database-common";
const weapon_of_logging = require("../utilities/LoggerConfig").logger
import { InitiativeObject } from "../Interfaces/GameSessionTypes";
import { initiativeEmbed } from "../services/create-embed";
import {secondLevelCollections, collectionTypes} from "../Interfaces/ServerCommunicationTypes";
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
        secondLevelCollections.INITIATIVE
      )) as InitiativeObject[];
      weapon_of_logging.info(
        {message: "getting initiative records", function:"listinitiative"}
      );
      let [isSorted, onDeck, sessionSize] = await getSession(sessionId);
      let sortedList = resortInitiative(newList);
      let initEmbed = initiativeEmbed(sortedList);
      weapon_of_logging.debug(
        {message: "sorted initiative and creating embed", function:"listinitiative"}
      );
      await interaction.reply({ embeds: [initEmbed] });
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.alert(
          {message: error.message, function:"listinitiative"}
        );
      }
    }
  },
};

export {};

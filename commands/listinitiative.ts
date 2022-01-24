// get session embed (initiative list in table format)
const { SlashCommandBuilder } = require("@discordjs/builders");
import { finalizeInitiative } from "../services/initiative";
import { retrieveCollection, getSession } from "../services/database-common";
const weapon_of_logging = require("../utilities/LoggerConfig").logger
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
      weapon_of_logging.info(
        {message: "getting initiative records", function:"listinitiative"}
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

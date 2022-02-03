const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  turnOrder,
  initiativeFunctionTypes,
} = require("../services/initiative");
import { retrieveRecord } from "../services/database-common";
import { io } from "../index";
import {
  collectionTypes,
  EmitTypes,
} from "../Interfaces/ServerCommunicationTypes";
import { statusEmbed } from "../services/create-embed";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prev")
    .setDescription("Move Turn Order Backwards"),
  async execute(interaction: any) {
    let [errorMsg, currentTurn, currentStatuses, currentId] = await turnOrder(
      interaction.channel.id,
      initiativeFunctionTypes.PREVIOUS
    );
    const statuses = statusEmbed(currentTurn, currentStatuses);
    if (errorMsg instanceof Error) {
      weapon_of_logging.alert({ message: errorMsg.message, function: "next" });
    }
    weapon_of_logging.info({
      message: "previous turn success",
      function: "next",
    });
    setTimeout(async () => {
      let record = await retrieveRecord(currentId, interaction.channel.id, collectionTypes.INITIATIVE)
      io.to(interaction.channel.id).emit(EmitTypes.NEXT, record);
    }, 300);
    await interaction.reply({ embeds: [statuses] });
  },
};

export {};

const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  turnOrder,
  initiativeFunctionTypes,
} = require("../services/initiative");
import { statusEmbed } from "../services/create-embed";
import { io } from "../index";
import {
  collectionTypes,
  EmitTypes,
} from "../Interfaces/ServerCommunicationTypes";
import { retrieveRecord } from "../services/database-common";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("next")
    .setDescription("Move turn order forward"),
  async execute(interaction: any) {
    try {
      let [errorMsg, currentTurn, currentStatuses, currentId] = await turnOrder(
        interaction.channel.id,
        initiativeFunctionTypes.NEXT
      );
      weapon_of_logging.debug({
        message: "after turnorder function",
        function: "next",
      });
      const statuses = statusEmbed(currentTurn, currentStatuses);
      if (errorMsg instanceof Error) {
        weapon_of_logging.alert({
          message: errorMsg.message,
          function: "next",
        });
      } else {
        weapon_of_logging.info({
          message: "next turn success",
          function: "next",
        });
      }
      setTimeout(async () => {
        let record = await retrieveRecord(currentId, interaction.channel.id, collectionTypes.INITIATIVE)
        console.log(record);
        io.to(interaction.channel.id).emit(EmitTypes.NEXT, record);
      }, 300);
      await interaction.reply({ embeds: [statuses] });
    } catch (error) {
      console.log(error);
      weapon_of_logging.warning({ message: error, function: "next" });
    }
  },
};

export {};

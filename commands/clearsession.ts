const { SlashCommandBuilder } = require("@discordjs/builders");
const { db } = require("../services/firebase-setup");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
import { EmitTypes } from "../Interfaces/ServerCommunicationTypes";
import { deleteSession } from "../services/database-common";
import { io } from "../index";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearsessionlist")
    .setDescription("Clear all initiative and spells for this session."),
  async execute(interaction: any) {
    try {
      let sessionId = interaction.channel.id;
      await deleteSession(sessionId);
      weapon_of_logging.debug({
        message: "reset of spells and initiative",
        function: "clearsessionlist",
      });
      io.to(interaction.channel.id).emit(EmitTypes.DELETE_ALL)
      await interaction.reply("Reset Complete");
    } catch (error) {
      console.log("error", error);
    }
  },
};

export {};

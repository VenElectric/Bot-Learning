const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  finalizeInitiative
} = require("../services/initiative");
const { db } = require("../services/firebase-setup");
import { initiativeEmbed } from "../services/create-embed";
import {InitiativeObject} from "../Interfaces/GameSessionTypes";
import { collectionTypes, EmitTypes } from "../Interfaces/ServerCommunicationTypes";
import { retrieveCollection } from "../services/database-common";
const weapon_of_logging = require("../utilities/LoggerConfig").logger
import { io } from "../index";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resort")
    .setDescription("Resort initiative and keep turn order."),
  async execute(interaction: any) {
	let newList;
    try {
      let snapshot = await db
        .collection("sessions")
        .doc(interaction.channel.id)
        .get();

      let isSorted = snapshot.data().isSorted
      let initiativeList = await retrieveCollection(interaction.channel.id, collectionTypes.INITIATIVE) as InitiativeObject[];
      weapon_of_logging.info({message: "successfully retrieved session data", function:"resort"});
      if (snapshot.data().isSorted) {
        newList = await finalizeInitiative(
          initiativeList,
          false,
          interaction.channel.id,
          2,
          true
        );
        weapon_of_logging.debug({message: "isSorted is true", function:"resort"})
      }
      if (!snapshot.data().isSorted){
        weapon_of_logging.debug({message: "isSorted is false", function:"resort"})
        await interaction.reply("Initiative has not been sorted yet. Please use the /start command.")
      }
      if (snapshot.data().isSorted === undefined) {
        for (let item in initiativeList) {
          initiativeList[item].isCurrent = false;
        }
        isSorted = true;
        newList = await finalizeInitiative(
          initiativeList,
          true,
          interaction.channel.id,
          2,
          false
        );
        weapon_of_logging.debug({message: "isSorted is undefined", function:"resort"})
      }

      let embed = initiativeEmbed(newList);
      weapon_of_logging.info({message: "resort complete", function:"resort"});
      io.to(interaction.channel.id).emit(EmitTypes.UPDATE_ALL_INITIATIVE,  {
        payload: newList,
        isSorted: isSorted,
      })
      await interaction.reply({
        content: "Initiative has been resorted.",
        embeds: [embed],
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        weapon_of_logging.alert(
          {message: error.message, function:"resort"}
        );
      }
    }
  },
};

export {};

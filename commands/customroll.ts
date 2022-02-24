const { SlashCommandBuilder } = require("@discordjs/builders");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
import { addSingle } from "../services/database-common";
import { v4 as uuidv4 } from "uuid";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { collectionTypes } from "../Interfaces/ServerCommunicationTypes";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("customroll")
    .setDescription("Create a custom roll")
    .addStringOption((option: any) =>
      option
        .setName("roll")
        .setDescription("The dice to roll with any modifiers. I.E. d20+3")
        .setRequired(true)
    )
    .addStringOption((option: any) =>
      option
        .setName("rollname")
        .setDescription("Name for custom roll")
        .setRequired(true)
    ),
  async execute(interaction: any) {
    const customRoll = interaction.options.getString("roll").toLowerCase();
    const rollName = interaction.options.getString("rollname");

    try {
      const tryRoll = new DiceRoll(customRoll);
    } catch (error) {
      interaction.channel.message(
        `Incorrect format for dice roll. Format should be the die to be rolled + any modifiers. I.E. d20+3 or 2d4+5. \n You tried to add: ${customRoll}`
      );
      return;
    }

    addSingle(
      { rollName: rollName, id: String(uuidv4()), rollValue: customRoll },
      interaction.channel.id,
      collectionTypes.ROLLS
    );
    weapon_of_logging.debug({
      message: "send to discord channel test",
      function: "ping",
    });

    interaction.reply("Custom Roll added successfully.");
  },
};

export {};

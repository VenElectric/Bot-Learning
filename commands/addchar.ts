const { SlashCommandBuilder } = require("@discordjs/builders");
const { v4: uuidv4 } = require("uuid");
import { addSingle } from "../services/database-common";
import { initiativeCollection } from "../services/constants";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addchar")
    .setDescription("Enter your initiative.")
    .addStringOption((option: any) =>
      option
        .setName("charactername")
        .setDescription("Enter Character Name")
        .setRequired(true)
    )
    .addIntegerOption((option: any) =>
      option
        .setName("initiativeroll")
        .setDescription("Enter Initiative Dice Roll (no modifier added)")
        .setRequired(true)
    )
    .addIntegerOption((option: any) =>
      option
        .setName("initiativemodifier")
        .setDescription("Enter Initiative Modifier")
        .setRequired(true)
    )
    .addBooleanOption((option: any) =>
      option.setName("isnpc").setDescription("NPC? True or False").setRequired(true)
    )
    .addBooleanOption((option: any) =>
      option.setName("isnat20").setDescription("Rolled a Nat 20?").setRequired(true)
    ),
  async execute(interaction: any) {
    let name = interaction.options.getString("charactername");
    let initiativeRoll = interaction.options.getInteger("initiativeroll");
    let initiativeModifier =
      interaction.options.getInteger("initiativemodifier");
    let isNpc = interaction.options.getBoolean("isnpc");
    let isNat20 = interaction.options.getBoolean("isnat20");

    if (isNat20){
      initiativeRoll += 100;
    }

    try {
      let options = {
        id: uuidv4(),
        characterName: name as string,
        initiative: initiativeRoll as number,
        initiativeModifier: initiativeModifier as number,
        roundOrder: 0,
        isCurrent: false,
        statusEffects: [],
        isNpc: isNpc,
      };

      let [isUploaded, errorMsg] = await addSingle(
        options,
        interaction.channelId,
        initiativeCollection
      );
      console.log(isUploaded);
      console.error(errorMsg);
      let replyString = `Your character, ${name}, has been added with an initiative of ${initiativeRoll} + ${initiativeModifier} = ${
        initiativeRoll + initiativeModifier
      }. You can edit this on the website component using the /link command. \n Any rolled nat 20's have 100 added on for sorting purposes.`;
      await interaction.reply(replyString);
    } catch (error) {
      if (error instanceof Error) {
        await interaction.reply(error.message);
      }
    }
  },
};

export {};

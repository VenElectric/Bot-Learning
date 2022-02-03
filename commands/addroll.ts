import { addBash } from "../services/parse";

const { SlashCommandBuilder } = require("@discordjs/builders");

const weapon_of_logging = require("../utilities/LoggerConfig").logger

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addroll")
    .setDescription("Used to add your dice roll to the collectrolls command.")
    .addStringOption((option: any) =>
      option
        .setName("tag")
        .setDescription("The tag noted when the collect rolls command was executed.")
        .setRequired(true)
    )
    .addStringOption((option: any) =>
      option
        .setName("rolltotal")
        .setDescription("The d20 roll plus any modifiers")
        .setRequired(true)
    )
    .addStringOption((option: any) =>
      option
        .setName("charactername")
        .setDescription("Optional: Add in the character name this roll is for.")
        .setRequired(false)
    ),
  async execute(interaction: any) {
    weapon_of_logging.alert({message: "send to discord channel test", function:"ping"})
    const tag = interaction.options.getString("tag");
    const rollAmount = interaction.options.getString("rollamount");
    const characterName = interaction.options.getString("charactername") || "";

    const finalComment = addBash(rollAmount, "green") + addBash(`${tag} ${characterName}`, "blue");
    
   
    interaction.reply(finalComment);
    
  },
};

export {};

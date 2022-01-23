const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import { BaseCommandInteraction } from "discord.js";
import { addBash } from "../services/parse";
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
require("dotenv").config();

// Forseen issues/requests:
// 1. Edit a collected response since player did not total something correctly or rolled the wrong dice.
// 2. Entered in the wrong amount of players to rollamount, and people have already entered their dice rolls
// Possibly combine this command with a second and third command (Add and Edit (need to differentiate from /addchar)) that allow the players to edit their responses
// Maybe also allow a manual command to stop the collector (I.E. like the reset collector I created) instead of using "rollamount". Or a conjunction of both. 
// Messaging on whether or not rollamount was entered. 
// I.E. Since you didn't enter a roll amount, the DM will need to use the stop command (no slash "/") to stop collection and show results
// And then with roll amount: The collection will stop after X results have been collected or after the idle time of XXX

module.exports = {
  data: new SlashCommandBuilder()
    .setName("collectrolls")
    .setDescription("Collect a series of player or NPC rolls.")
    .addStringOption((option: any) =>
      option
        .setName("tag")
        .setDescription("Enter a tag so the bot can collect rolls!")
        .setRequired(true)
    )
    .addIntegerOption((option: any) =>
      option
        .setName("rollamount")
        .setDescription("Number of PC/NPC dice rolls to be collected.")
        .setRequired(true)
    ),
  async execute(interaction: any) {
    const tag = interaction.options.getString("tag");
    const rollAmount = interaction.options.getInteger("rollamount");
    const resetFilter = (m: any) => m.content.includes("reset");
    const filter = (m: any) =>
      m.content.includes(`${tag}`) &&
      m.author.username === process.env.BOT_NAME;
    const embed = new MessageEmbed()
      .setTitle(`Embed for the tag: ${tag}`)
      .setColor("#0099ff");
    let isReset = false;
    weapon_of_logging.log({
      level: "debug",
      message: `Tag: ${tag} RollAmount: ${rollAmount}`,
      function: "collectRolls",
    });
    if (tag === null || rollAmount === null) {
      await interaction.reply(
        "Please enter a tag and number of dice rolls when you run this command. If you need help with this command, please use the /help slash command."
      );
      weapon_of_logging.warn({
        message: "tag or roll amount is null",
        function: "collectrolls",
      });
      return;
    }
    try {
      weapon_of_logging.log({
        level: "debug",
        message: "testing logger",
        function: "collectRolls",
      });
      // retest collector so that it does not collect the initial interaction
      const collector = interaction.channel.createMessageCollector({
        filter: filter,
        idle: 60000,
      });
      const resetCollector = interaction.channel.createMessageCollector({
        filter: resetFilter,
        idle: 60000,
      });
      weapon_of_logging.debug({
        message: "initiating collector",
        function: "collectrolls",
      });
      await interaction.reply(
        `Enter your rolls with the tag: \n\`\`\`css\n${tag}\n\`\`\` Leave a comment after the tag if you need to separate different rolls for different characters.\n I.E. \`\`\`\nd20+3 ${tag} Meridia\n\`\`\``
      );

      resetCollector.on("collect", (m: any) => {
        isReset = true;
        collector.stop();
        resetCollector.stop();
        weapon_of_logging.info({
          message: "Collector has been reset",
          function: "collectrolls",
        });
      });

      collector.on("collect", async (m: any) => {
        if (collector.collected.size > rollAmount) {
          weapon_of_logging.debug({
            message: "stopping collector",
            function: "collectrolls",
          });
          collector.stop();
        }
        // regex to get character name out of comment
        let commentArray = m.content.split("\n");

        let characterName = commentArray[1]
          .replace("[", "")
          .replace("]``````bash", "")
          .replace(tag, "")
          .trim();

        let roll = addBash(
          commentArray[2].replace("```", "").replace('"', ""),
          "green"
        );

        weapon_of_logging.debug({
          message: `collected roll ${commentArray[2]}`,
          function: "collectrolls",
        });

        if (characterName.length > 0) {
          embed.addField(
            "\u200b",
            `${addBash(characterName, "blue")} ${roll}`,
            false
          );
        } else {
          interaction.guild.members
            .fetch(m.mentions.repliedUser?.id)
            .then((username: any) => {
              let nickname = addBash(username.nickname, "blue");
              weapon_of_logging.debug({
                message: "nickname successfully fetched",
                function: "collectrolls",
              });
              embed.addField("\u200b", `${nickname} ${roll}`, false);
            })
            .catch((error: any) => {
              weapon_of_logging.error({
                message: "could not find guild member or uncaught error",
                function: "collectrolls",
              });
              console.log(error);
            });
        }
      });

      collector.on("end", async (collected: any) => {
        
        if (!isReset) {
          weapon_of_logging.info({
            message: "collector successuflly ended !isReset",
            function: "collectrolls",
          });
          await interaction.editReply("Collection ended");
          await interaction.channel.send({ embeds: [embed] });
        }
        else {
          weapon_of_logging.info({
            message: "collector successuflly ended else statement",
            function: "collectrolls",
          });
          await interaction.editReply(
            "Please use the /collectrolls command again to start the collector."
          );
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        weapon_of_logging.error({
          message: error.message,
          function: "collectrolls",
        });
      }
    }
  },
};

export {};

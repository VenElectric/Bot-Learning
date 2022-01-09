const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import { addBash } from "../services/parse";

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
    const filter = (m: any) =>
      m.content.includes(`${tag}`) && m.author.username === "Initiative Bot";
    const embed = new MessageEmbed()
      .setTitle(`Embed for the tag: ${tag}`)
      .setColor("#0099ff");

    if (tag === null || rollAmount === null) {
      await interaction.reply(
        "Please enter a tag and number of dice rolls when you run this command. If you need help with this command, please use the /help slash command."
      );
      return;
    }
    try {
      // retest collector so that it does not collect the initial interaction
      const collector = interaction.channel.createMessageCollector({
        filter: filter,
        idle: 60000,
      });
      await interaction.reply(
        `**[Enter your rolls with the tag ${tag}]**\n Leave a comment after the tag if you need to separate different rolls for different characters.\n I.E. d20+3 tag Meridia`
      );

      collector.on("collect", async (m: any) => {
        if (collector.collected.size > rollAmount) {
          collector.stop();
        }
        // regex to get character name out of comment
        let commentArray = m.content.split("\n");

        let characterName =commentArray[1]
            .replace("[", "")
            .replace("]``````bash", "")
            .replace(tag, "")
            .trim();

        let roll = addBash(
          commentArray[2].replace("```", "").replace('"', ""),
          "green"
        );

        if (characterName.length > 0) {
          embed.addField("\u200b", `${addBash(characterName, "blue")} ${roll}`, false);
        } else {
          interaction.guild.members
            .fetch(m.mentions.repliedUser?.id)
            .then((username: any) => {
              let nickname = addBash(username.nickname, "blue");
              embed.addField("\u200b", `${nickname} ${roll}`, false);
            })
            .catch((error: any) => {
              console.log(error);
            });
        }
      });

      collector.on("end", async (collected: any) => {
        await interaction.editReply("Collection ended");
        await interaction.channel.send({ embeds: [embed] });
        // embed is being sent before the above code. So embed is empty when it is sent to the channel.
      });
    } catch (error) {
      console.log(error);
    }
  },
}

export {}
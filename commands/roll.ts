const { SlashCommandBuilder } = require("@discordjs/builders");
import { Message } from "discord.js";
import { parseRoll } from "../services/parse";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { weapon_of_logging } from "../utilities/LoggingClass";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice!"),
  async execute(message: Message) {
    try {
      // split into an array
      let sessionId = message.channel.id
      let args = message.content.trim().split(/ +/);

      weapon_of_logging.INFO("rollerargs", "Args are", args,sessionId)

      // remove any unecessary characters I.E. / or /r or r if someone is using that as a command (other rollers use this, easier to take into account rather than retrain)
      if (args[0].match(/\/[a-z]|\/|[r|R]/)) {
        args.splice(0, 1);
      }
      // parse the roll from the comments
      let parsed = parseRoll(args);
      // make sure no trailing spaces
      let comment = parsed.comment.trim();

      // roll the roll
      // make sure that the format is dXX rather than DXX.
      let myroll = new DiceRoll(String(parsed.rollex).toLowerCase());

      // spice up the text with some formatting
      let finalroll = "```bash\n" + '"' + myroll + '"' + "```";
      let finalcomment = "```ini\n" + "[" + comment + `]` + "```";

      // if no comment, then don't include the finalcomment var. if comment, then include the entire text.
      if (comment != "") {
        // "Roll Results: " + finalcomment + finalroll
        weapon_of_logging.INFO(
            "D20 roll",
            "grabbing args",
            finalroll,
            sessionId
          );
        await message.reply("Roll Results: " + finalcomment + finalroll);
      } else {
        weapon_of_logging.INFO(
            "D20 roll",
            "finalcomment",
            finalcomment,
            sessionId
          );
          weapon_of_logging.INFO(
            "D20 roll",
            "finalroll",
            finalroll,
            sessionId
          );
        await message.reply("Roll Results: " + finalroll);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        weapon_of_logging.NOTICE(
          error.name,
          error.message,
          message.content,
          message.channel.id
        );
      }
      await message.reply(
        "There was an error with the dice roll. Please try again with the correct dice format."
      );
    }
  },
};

export {};

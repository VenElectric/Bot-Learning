const { SlashCommandBuilder } = require("@discordjs/builders");
import { Message } from "discord.js";
import { parseRoll,addBash } from "../services/parse";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
const weapon_of_logging = require("../utilities/LoggerConfig").logger

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice!"),
  async execute(message: Message) {
    try {
      // split into an array
      let args;
      if(message.content[0].match(/^(\/|[a-z])/)){
        args = message.content.trim().replace("/","").split(" ");
        weapon_of_logging.debug({message: `roller args regex ${args}`, function:"roll"});
      }
      else{
        args = message.content.trim().split(/ +/);
        weapon_of_logging.debug({message: `roller args else ${args}`, function:"roll"});
      }

     
     

      // remove any unecessary characters I.E. / or /r or r if someone is using that as a command (other rollers use this, easier to take into account rather than retrain)
      if (args[0].match(/\/[a-z]|\/|[r|R]/)) {
        args.splice(0, 1);
      }
      // parse the roll from the comments
      let parsed = parseRoll(args);
      // make sure no trailing spaces
      let comment = parsed.comment.trim();
      weapon_of_logging.debug({message: `parsed completed ${parsed}`, function:"roll"});
      // if (parsed.rollex === ""){
      //   parsed = args
      // }

      // roll the roll
      // make sure that the format is dXX rather than DXX.
      let myroll = new DiceRoll(String(parsed.rollex).toLowerCase());

      // spice up the text with some formatting
      let finalroll = "```bash\n" + '"' + myroll + '"' + "```";
      let finalcomment = "```ini\n" + "[" + comment + `]` + "```";

      // if no comment, then don't include the finalcomment var. if comment, then include the entire text.
      if (comment != "") {
        // "Roll Results: " + finalcomment + finalroll
        weapon_of_logging.debug(
          {message: `replying with comment Roll: ${finalroll} Comment: ${finalcomment}`, function:"roll"}
        );
        await message.reply("Roll Results: " + finalcomment + finalroll);
      } else {
        weapon_of_logging.info(
          {message: `replying without comment Roll: ${finalroll}`, function:"roll"}
        );
        await message.reply("Roll Results: " + finalroll);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error)
        weapon_of_logging.warn(
          {message: error.message, function:"roll"}
        );
      }
      await message.reply(
        "There was an error with the dice roll. Please try again with the correct dice format."
      );
    }
  },
};

export {};

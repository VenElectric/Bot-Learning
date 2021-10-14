const { SlashCommandBuilder } = require("@discordjs/builders");
import { Message } from "discord.js";
import parse_args from "../services/parse";
const {DiceRoll} = require('rpg-dice-roller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Replies with Pong!"),
	async execute(message: Message) {
    
        try{
            // split into an array
            let args = message.content.trim().split(/ +/);

            // remove /r if someone is using that as a command (other rollers use this, easier to take into account rather than retrain)
            if (args[0].match(/(\/r)/)) {
                args.splice(0,1)
            }
            // parse the roll from the comments
            let parsed = parse_args(args)
            
            // make sure no trailing spaces
            let comment = parsed.comment.trim()
            // roll the roll
            let myroll = new DiceRoll(String(parsed.rollex))

            // spice up the text with some formatting
            let finalroll = '```bash\n' + '"' + myroll + '"' + '```'
            let finalcomment = '```ini\n' + '[' + comment + `]` + '```'
            
            // if no comment, then don't include the finalcomment var. if comment, then include the entire text.
            if (comment != "")
                {
                    await message.reply("Roll Results: " + finalroll + finalcomment);
                }
            else{
                    await message.reply("Roll Results: " + finalroll);
                }
        }
        catch(error){
            console.log(error)
            await message.reply("There was an error with the dice roll. Please try again with the correct dice format.")
        }
        

	},
};

export {}
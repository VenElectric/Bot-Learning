"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const parse_1 = require("../services/parse");
const rpg_dice_roller_1 = require("@dice-roller/rpg-dice-roller");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a dice!"),
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // split into an array
                let args = message.content.trim().split(/ +/);
                // remove any unecessary characters I.E. / or /r or r if someone is using that as a command (other rollers use this, easier to take into account rather than retrain)
                if (args[0].match(/\/[a-z]|\/|[r|R]/)) {
                    args.splice(0, 1);
                }
                // parse the roll from the comments
                let parsed = (0, parse_1.parseRoll)(args);
                // make sure no trailing spaces
                let comment = parsed.comment.trim();
                // roll the roll
                // make sure that the format is dXX rather than DXX. 
                let myroll = new rpg_dice_roller_1.DiceRoll(String(parsed.rollex).toLowerCase());
                // spice up the text with some formatting
                let finalroll = '```bash\n' + '"' + myroll + '"' + '```';
                let finalcomment = '```ini\n' + '[' + comment + `]` + '```';
                // if no comment, then don't include the finalcomment var. if comment, then include the entire text.
                if (comment != "") {
                    // "Roll Results: " + finalcomment + finalroll
                    yield message.reply("Roll Results: " + finalcomment + finalroll);
                }
                else {
                    yield message.reply("Roll Results: " + finalroll);
                }
            }
            catch (error) {
                console.log(error);
                yield message.reply("There was an error with the dice roll. Please try again with the correct dice format.");
            }
        });
    },
};

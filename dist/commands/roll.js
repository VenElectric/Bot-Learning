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
const { SlashCommandBuilder } = require("discord.js");
const parse_1 = require("../services/parse");
const { logRoll, dice } = require("../utilities/RollDice");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a dice!"),
    description: `Type any dXX (d10, d20, d4, d8, d100, etc. etc.) and roll the dice. No / necessary. You can add a comment after as well! Example: d20+5 To Hit`,
    execute(commands, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // split into an array
                let args;
                if (interaction.content.match(/https:/))
                    return;
                if (interaction.content[0].match(/^(\/|[a-z])/)) {
                    args = interaction.content.trim().replace("/", "").split(" ");
                    weapon_of_logging.debug({
                        interaction: `roller args regex ${args}`,
                        function: "roll",
                    });
                }
                else {
                    args = interaction.content.trim().split(/ +/);
                    weapon_of_logging.debug({
                        interaction: `roller args else ${args}`,
                        function: "roll",
                    });
                }
                // remove any unecessary characters I.E. / or /r or r if someone is using that as a command (other rollers use this, easier to take into account rather than retrain)
                if (args[0].match(/\/[a-z]|\/|[r|R]/)) {
                    args.splice(0, 1);
                }
                // parse the roll from the comments
                let parsed = (0, parse_1.parseRoll)(args);
                // make sure no trailing spaces
                let comment = parsed.comment.trim();
                weapon_of_logging.debug({
                    interaction: `parsed completed ${parsed}`,
                    function: "roll",
                });
                const user = yield interaction.guild.members.fetch(interaction.author.id);
                const name = user.nickname || interaction.author.username;
                // roll the roll
                // make sure that the format is dXX rather than DXX.
                let myroll = dice.roll(String(parsed.roll).toLowerCase());
                logRoll(myroll, name, comment, interaction.channel.id);
                if (!myroll) {
                    throw new Error("invalid dice roll");
                }
                // spice up the text with some formatting
                let finalroll = (0, parse_1.addBash)(myroll, "green");
                let finalcomment = (0, parse_1.addBash)(comment, "blue");
                // if no comment, then don't include the finalcomment var. if comment, then include the entire text.
                if (comment != "") {
                    // "Roll Results: " + finalcomment + finalroll
                    weapon_of_logging.debug({
                        interaction: `replying with comment Roll: ${finalroll} Comment: ${finalcomment}`,
                        function: "roll",
                    });
                    yield interaction.reply("Roll Results: " + finalcomment + finalroll);
                }
                else {
                    weapon_of_logging.info({
                        interaction: `replying without comment Roll: ${finalroll}`,
                        function: "roll",
                    });
                    yield interaction.reply("Roll Results: " + finalroll);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                    weapon_of_logging.warning({
                        interaction: error.message,
                        function: "roll",
                    });
                }
                yield interaction.reply("There was an error with the dice roll. Please try again with the correct dice format.");
            }
        });
    },
};

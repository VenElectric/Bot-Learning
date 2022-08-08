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
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a dice!"),
    description: `Type any dXX (d10, d20, d4, d8, d100, etc. etc.) and roll the dice. No / necessary. You can add a comment after as well! Example: d20+5 To Hit`,
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // split into an array
                let args;
                if (interaction.content.match(/https:/))
                    return;
                if (interaction.content[0].match(/^(\/|[a-z])/)) {
                    args = interaction.content.trim().replace("/", "").split(" ");
                    sonic.log(`roller args regex ${args}`, sonic.debug, "roll");
                }
                else {
                    args = interaction.content.trim().split(/ +/);
                    sonic.log(`roller args else ${args}`, sonic.debug, "roll");
                }
                // remove any unecessary characters I.E. / or /r or r if someone is using that as a command (other rollers use this, easier to take into account rather than retrain)
                if (args[0].match(/\/[a-z]|\/|[r|R]/)) {
                    args.splice(0, 1);
                }
                // parse the roll from the comments
                let parsed = sonic.parseRoll(args);
                // make sure no trailing spaces
                let comment = parsed.comment.trim();
                sonic.log(`parsed completed ${parsed}`, sonic.info, "roll");
                const user = yield interaction.guild.members.fetch(interaction.author.id);
                const name = user.nickname || interaction.author.username;
                // roll the roll
                // make sure that the format is dXX rather than DXX.
                sonic.emit("getDice", (roller) => __awaiter(this, void 0, void 0, function* () {
                    const myRoll = roller.roll(String(parsed.roll).toLowerCase());
                    roller.logRoll(myRoll, name, comment, interaction.channel.id);
                    if (!myRoll) {
                        throw new Error("invalid dice roll");
                    }
                    // spice up the text with some formatting
                    const finalroll = (0, parse_1.addBash)(myRoll, "green");
                    const finalcomment = (0, parse_1.addBash)(comment, "blue");
                    // if no comment, then don't include the finalcomment var. if comment, then include the entire text.
                    if (comment != "") {
                        // "Roll Results: " + finalcomment + finalroll
                        sonic.log(`replying with comment Roll: ${finalroll} Comment: ${finalcomment}`, sonic.debug, "roll");
                        yield interaction.reply("Roll Results: " + finalcomment + finalroll);
                    }
                    else {
                        sonic.log(`replying without comment Roll: ${finalroll}`, sonic.debug, "roll");
                        yield interaction.reply("Roll Results: " + finalroll);
                    }
                }));
            }
            catch (error) {
                if (error instanceof Error) {
                    sonic.onError(error, "roll", interaction.content);
                }
                yield interaction.reply("There was an error with the dice roll. Please try again with the correct dice format.");
            }
        });
    },
};

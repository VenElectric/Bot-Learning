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
const { MessageEmbed } = require("discord.js");
const parse_1 = require("../services/parse");
const LoggingClass_1 = require("../utilities/LoggingClass");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("collectrolls")
        .setDescription("Collect a series of player or NPC rolls.")
        .addStringOption((option) => option
        .setName("tag")
        .setDescription("Enter a tag so the bot can collect rolls!")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("rollamount")
        .setDescription("Number of PC/NPC dice rolls to be collected.")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionId = interaction.channel.id;
            const tag = interaction.options.getString("tag");
            const rollAmount = interaction.options.getInteger("rollamount");
            const filter = (m) => m.content.includes(`${tag}`) && m.author.username === "Initiative Bot";
            const embed = new MessageEmbed()
                .setTitle(`Embed for the tag: ${tag}`)
                .setColor("#0099ff");
            if (tag === null || rollAmount === null) {
                yield interaction.reply("Please enter a tag and number of dice rolls when you run this command. If you need help with this command, please use the /help slash command.");
                LoggingClass_1.weapon_of_logging.NOTICE("CollectRolls", "tag or roll ammount is null", interaction.content, sessionId);
                return;
            }
            try {
                // retest collector so that it does not collect the initial interaction
                const collector = interaction.channel.createMessageCollector({
                    filter: filter,
                    idle: 60000,
                });
                yield interaction.reply(`**[Enter your rolls with the tag ${tag}]**\n Leave a comment after the tag if you need to separate different rolls for different characters.\n I.E. d20+3 tag Meridia`);
                collector.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (collector.collected.size > rollAmount) {
                        collector.stop();
                    }
                    // regex to get character name out of comment
                    let commentArray = m.content.split("\n");
                    let characterName = commentArray[1]
                        .replace("[", "")
                        .replace("]``````bash", "")
                        .replace(tag, "")
                        .trim();
                    let roll = (0, parse_1.addBash)(commentArray[2].replace("```", "").replace('"', ""), "green");
                    LoggingClass_1.weapon_of_logging.INFO("CollectRolls", "infocollected", { characterName: characterName, roll: roll, commentArray: commentArray }, sessionId);
                    if (characterName.length > 0) {
                        embed.addField("\u200b", `${(0, parse_1.addBash)(characterName, "blue")} ${roll}`, false);
                    }
                    else {
                        interaction.guild.members
                            .fetch((_a = m.mentions.repliedUser) === null || _a === void 0 ? void 0 : _a.id)
                            .then((username) => {
                            let nickname = (0, parse_1.addBash)(username.nickname, "blue");
                            LoggingClass_1.weapon_of_logging.INFO("CollectRolls", "nickname", nickname, sessionId);
                            embed.addField("\u200b", `${nickname} ${roll}`, false);
                        })
                            .catch((error) => {
                            LoggingClass_1.weapon_of_logging.NOTICE(error.name, error.message, m, sessionId);
                            console.log(error);
                        });
                    }
                }));
                collector.on("end", (collected) => __awaiter(this, void 0, void 0, function* () {
                    LoggingClass_1.weapon_of_logging.INFO("collected", "collectedrolls", collected, sessionId);
                    yield interaction.editReply("Collection ended");
                    yield interaction.channel.send({ embeds: [embed] });
                    // embed is being sent before the above code. So embed is empty when it is sent to the channel.
                }));
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    LoggingClass_1.weapon_of_logging.CRITICAL(error.name, error.message, error.stack, interaction.content, sessionId);
                }
            }
        });
    },
};

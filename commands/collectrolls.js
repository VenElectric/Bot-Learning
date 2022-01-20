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
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
require("dotenv").config();
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
            const tag = interaction.options.getString("tag");
            const rollAmount = interaction.options.getInteger("rollamount");
            const resetFilter = (m) => m.content.includes("reset");
            const filter = (m) => m.content.includes(`${tag}`) &&
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
                yield interaction.reply("Please enter a tag and number of dice rolls when you run this command. If you need help with this command, please use the /help slash command.");
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
                yield interaction.reply(`**[Enter your rolls with the tag ${tag}]**\n Leave a comment after the tag if you need to separate different rolls for different characters.\n I.E. d20+3 tag Meridia`);
                resetCollector.on("collect", (m) => {
                    isReset = true;
                    collector.stop("reset");
                    resetCollector.stop();
                    weapon_of_logging.info({
                        message: "Collector has been reset",
                        function: "collectrolls",
                    });
                });
                collector.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
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
                    let roll = (0, parse_1.addBash)(commentArray[2].replace("```", "").replace('"', ""), "green");
                    weapon_of_logging.debug({
                        message: `collected roll ${commentArray[2]}`,
                        function: "collectrolls",
                    });
                    if (characterName.length > 0) {
                        embed.addField("\u200b", `${(0, parse_1.addBash)(characterName, "blue")} ${roll}`, false);
                    }
                    else {
                        interaction.guild.members
                            .fetch((_a = m.mentions.repliedUser) === null || _a === void 0 ? void 0 : _a.id)
                            .then((username) => {
                            let nickname = (0, parse_1.addBash)(username.nickname, "blue");
                            weapon_of_logging.debug({
                                message: "nickname successfully fetched",
                                function: "collectrolls",
                            });
                            embed.addField("\u200b", `${nickname} ${roll}`, false);
                        })
                            .catch((error) => {
                            weapon_of_logging.error({
                                message: "could not find guild member or uncaught error",
                                function: "collectrolls",
                            });
                            console.log(error);
                        });
                    }
                }));
                collector.on("end", (collected) => __awaiter(this, void 0, void 0, function* () {
                    if (!isReset) {
                        weapon_of_logging.info({
                            message: "collector successuflly ended !isReset",
                            function: "collectrolls",
                        });
                        yield interaction.editReply("Collection ended");
                        yield interaction.channel.send({ embeds: [embed] });
                    }
                    else {
                        weapon_of_logging.info({
                            message: "collector successuflly ended else statement",
                            function: "collectrolls",
                        });
                        yield interaction.editReply("Please use the /collectrolls command again to start the collector.");
                    }
                }));
            }
            catch (error) {
                if (error instanceof Error) {
                    weapon_of_logging.error({
                        message: error.message,
                        function: "collectrolls",
                    });
                }
            }
        });
    },
};

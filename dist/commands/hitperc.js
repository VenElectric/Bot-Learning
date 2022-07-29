"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("discord.js");
const { evaluate } = require("mathjs");
require("dotenv").config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName("hitperc")
        .setDescription("Calculate Hit Chance")
        .addIntegerOption((option) => option
        .setName("armorclass")
        .setDescription("AC of the defender")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("attackbonus")
        .setDescription("Attacker's bonus to hit")
        .setRequired(true)),
    description: "Use this to calculate your percent to hit. This only takes AC and your attack bonus into account.",
    async execute(interaction) {
        weapon_of_logging.info({ message: "sending link url", function: "link" });
        const armorClass = interaction.options.getInteger("armorclass");
        const attackBonus = interaction.options.getInteger("attackbonus");
        const hitPercent = evaluate(((21 - (armorClass - attackBonus)) / 20) * 100);
        await interaction.reply(`Hit percent is: ${hitPercent}%`);
    },
};

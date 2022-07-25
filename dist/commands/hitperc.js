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
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const { SlashCommandBuilder } = require("@discordjs/builders");
const { evaluate } = require('mathjs');
require("dotenv").config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName("hitperc")
        .setDescription("Calculate Hit Chance")
        .addIntegerOption((option) => option
        .setName("armorclass")
        .setDescription("AC of the defender")
        .setRequired(true)).addIntegerOption((option) => option
        .setName("attackbonus")
        .setDescription("Attacker's bonus to hit")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.info({ message: "sending link url", function: "link" });
            const armorClass = interaction.options.getInteger("armorclass");
            const attackBonus = interaction.options.getInteger("attackbonus");
            const hitPercent = evaluate(((21 - (armorClass - attackBonus)) / 20) * 100);
            yield interaction.reply(`Hit percent is: ${hitPercent}%`);
        });
    },
};

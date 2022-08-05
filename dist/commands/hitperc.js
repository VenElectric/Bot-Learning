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
const { evaluate } = require("mathjs");
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
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.channel == null)
                return;
            const commandName = interaction.commandName;
            sonic.log("evaluating...", sonic.info, commandName);
            const armorClass = interaction.options.getInteger("armorclass", true);
            const attackBonus = interaction.options.getInteger("attackbonus", true);
            const hitPercent = sonic.eval(((21 - (armorClass - attackBonus)) / 20) * 100);
            // type for evaluate in math js
            yield interaction.reply(`Hit percent is: ${hitPercent}%`);
        });
    },
};

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
const parse_1 = require("../services/parse");
const { SlashCommandBuilder } = require("discord.js");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
// todo change this to a context menu
// deprecate????
// what should I do to change this?
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addroll")
        .setDescription("Used to add your dice roll to the collectrolls command.")
        .addStringOption((option) => option
        .setName("tag")
        .setDescription("The tag noted when the collect rolls command was executed.")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("rolltotal")
        .setDescription("The d20 roll plus any modifiers")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("charactername")
        .setDescription("Optional: Add in the character name this roll is for.")
        .setRequired(false)),
    execute(commands, sonic, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            weapon_of_logging.alert({ message: "send to discord channel test", function: "ping" });
            const tag = interaction.options.getString("tag");
            const rollAmount = interaction.options.getString("rollamount");
            const characterName = interaction.options.getString("charactername") || "";
            const finalComment = (0, parse_1.addBash)(rollAmount, "green") + (0, parse_1.addBash)(`${tag} ${characterName}`, "blue");
            interaction.reply(finalComment);
        });
    },
};

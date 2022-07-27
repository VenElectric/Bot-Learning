"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("../services/parse");
const { SlashCommandBuilder } = require("@discordjs/builders");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
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
    async execute(interaction) {
        weapon_of_logging.alert({ message: "send to discord channel test", function: "ping" });
        const tag = interaction.options.getString("tag");
        const rollAmount = interaction.options.getString("rollamount");
        const characterName = interaction.options.getString("charactername") || "";
        const finalComment = (0, parse_1.addBash)(rollAmount, "green") + (0, parse_1.addBash)(`${tag} ${characterName}`, "blue");
        interaction.reply(finalComment);
    },
};

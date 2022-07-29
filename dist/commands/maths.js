"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("discord.js");
const { evaluate } = require('mathjs');
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const diceRegex = new RegExp(/(\/|\/[a-z]|\/[A-Z]|r)*\s*([d|D])([\d])+/);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("maths")
        .setDescription("1+1 = ?"),
    description: `Do some basic math. 1+1 = ? \n You can also send a math equation without using the slash command.`,
    async execute(commands, interaction) {
        try {
            if (interaction.content.match(diceRegex)) {
                const rollCom = commands.get("roll");
                rollCom?.execute(commands, interaction);
            }
            else {
                const answer = evaluate(interaction.content);
                weapon_of_logging.info({ message: "math calculation completed", function: "maths" });
                await interaction.reply(`Answer: ${answer}`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                await interaction.reply(error.message);
                weapon_of_logging.alert({ message: error.message, function: "maths" });
            }
        }
    },
};

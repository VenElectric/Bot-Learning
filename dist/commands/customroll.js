"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const weapon_of_logging = require("../utilities/LoggerConfig").logger;
const database_common_1 = require("../services/database-common");
const uuid_1 = require("uuid");
const rpg_dice_roller_1 = require("@dice-roller/rpg-dice-roller");
const ServerCommunicationTypes_1 = require("../Interfaces/ServerCommunicationTypes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("customroll")
        .setDescription("Create a custom roll")
        .addStringOption((option) => option
        .setName("roll")
        .setDescription("The dice to roll with any modifiers. I.E. d20+3")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("rollname")
        .setDescription("Name for custom roll")
        .setRequired(true)),
    async execute(interaction) {
        const customRoll = interaction.options.getString("roll").toLowerCase();
        const rollName = interaction.options.getString("rollname");
        try {
            const tryRoll = new rpg_dice_roller_1.DiceRoll(customRoll);
        }
        catch (error) {
            interaction.channel.message(`Incorrect format for dice roll. Format should be the die to be rolled + any modifiers. I.E. d20+3 or 2d4+5. \n You tried to add: ${customRoll}`);
            return;
        }
        (0, database_common_1.addSingle)({ rollName: rollName, id: String((0, uuid_1.v4)()), rollValue: customRoll }, interaction.channel.id, ServerCommunicationTypes_1.topLevelCollections.SESSIONS, ServerCommunicationTypes_1.secondLevelCollections.ROLLS);
        weapon_of_logging.debug({
            message: "send to discord channel test",
            function: "ping",
        });
        interaction.reply("Custom Roll added successfully.");
    },
};
